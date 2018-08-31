<template>
  <div class="page newcswork">
    <!--<x-header :left-options="{showBack:true,backText:'返回'}">
                            新建工作
                        </x-header>-->
    <div class="weui-tab-bd">
      <group title="基本信息">
        <datetime v-model="ReceiveTime" format="YYYY-MM-DD HH:mm" title="来电时间" confirm-text="完成" cancel-text="取消"></datetime>
        <datetime v-model="CompleteTime" format="YYYY-MM-DD HH:mm" title="完成时间" confirm-text="完成" cancel-text="取消"></datetime>
        <cell is-link title="医院名称" @click.native="loadHosps" v-model="hospName"> </cell>
        <cell is-link title="产品名称" @click.native="loadProducts" v-model="strProduct"></cell>
        <cell is-link title="联系人" @click.native="loadUsers" v-model="contactUser"></cell>
        <popup-picker title="故障类别" :data="categorys" v-model="category"></popup-picker>
        <popup-picker title="处理方式" :data="methods" v-model="execMethod"></popup-picker>
          <uploader :images="images" title="上传图片" :handle-click="true" :show-header="true" :readonly="false" :upload-url="uploadUrl" size="small" @preview="prevImg" @remove-image="removeImg" @add-image="chooseImg"></uploader>
      </group>
      <group title="问题描述">
        <x-textarea :max="200" placeholder="详细问题描述'" v-model="desc" :height="100">
        </x-textarea>
      </group>
      <group title="解决方案">
        <x-textarea :max="500" placeholder="详细解决方案" v-model="solution" :height="150">
        </x-textarea>
      </group>
      <!-- <group>
        <cell>
          <uploader slot="after-title" :count="fileCount" :maxlength="1" @select-file="chooseImg">
                <span slot="title">文件上传</span>
                <uploader-files slot="uploader-files" v-show="showfile" :image-url="imgPath">
                </uploader-files>
              </uploader> 
        
        </cell>
      </group>-->
      <box gap="10px 10px" v-show="!showFlow">
        <x-button @click.native="addData" type="primary">新增</x-button>
      </box>
      <box gap="10px 10px" v-show="showFlow">
        <x-button @click.native="saveData" type="primary">保存</x-button>
      </box>
      <box gap="10px 10px" v-show="showFlow">
        <x-button @click.native="sendFlow" type="primary">发起流程</x-button>
      </box>
    </div>
  
    <!--选择医院的popup-->
    <popup v-model="showHosp" height="80%">
      <div class="popup">
        <tab>
          <tab-item :selected="hospIndex==0" @click.native="hospIndex=0">
            我的医院
          </tab-item>
          <tab-item :selected="hospIndex==1" @click.native="hospIndex=1">
            所有医院
          </tab-item>
        </tab>
        <div class="weui-tab-bd">
          <div v-show="hospIndex==0">
            <group>
              <cell v-for="item in MyHosp" :key="item.HospName" @click.native="selectHosp(item.HospId,item.HospName)" :title="item.HospName">
              </cell>
            </group>
          </div>
          <div v-show="hospIndex==1">
            <search @result-click="resultClick" @on-submit="getResult" placeholder="输入关键字后回车" cancel-text="取消" :results="result" v-model="hospKey"></search>
          </div>
        </div>
      </div>
    </popup>
    <!--产品-->
    <popup v-model="showProduct" height="80%">
      <div class="popup">
        <group>
          <box gap="10px 10px">
            <x-button @click.native="selectProduct" type="primary">确定选择</x-button>
          </box>
          <checklist title="选择产品" :options="productList" v-model="Product"></checklist>
        </group>
      </div>
    </popup>
  
    <!--医院联系人-->
    <popup v-model="showUser" height="80%">
      <div class="popup">
        <group title="医院联系人">
          <radio :options="Users" @on-change="selectUser"></radio>
        </group>
      </div>
    </popup>
  
  </div>
</template>

<script>
  import {
    XHeader,
    Group,
    Cell,
    Tab,
    TabItem,
    Scroller,
    PopupPicker,
    Datetime,
    XInput,
    XTextarea,
    Box,
    XButton,
    Popup,
    Checklist,
    Radio,
    Selector,
    Search
  } from 'vux'
  import Uploader from 'vux-uploader'
  import common from '../utils/common';
  import wxutils from '../utils/wxUtils'
  export default {
    name: 'newcswork',
    data() {
      return {
        dispNo: "",
        ReceiveTime: "",
        CompleteTime: "",
        Hospital: [],
        MyHosp: [],
        // 医院
        showHosp: false,
        hospIndex: 0,
        HospId: 0,
        hospName: '',
        hospKey: '',
        result: [],
        // 产品
        showProduct: false,
        Product: [],
        strProduct: "",
        productList: [],
        // 医院联系人
        showUser: false,
        Users: [],
        contactUser: "",
        // 故障类别
        categorys: [
          ["故障报修", "系统巡检", "跟踪维保合同及回款"]
        ],
        category: ["故障报修"],
        // 处理方式
        methods: [
          ["现场处理", "远程处理"]
        ],
        execMethod: ["现场处理"],
        // 附件上传
        fileCount: 0,
        showfile: false,
        imgPath: '',
        // 问题描述
        desc: '',
        // 解决方案
        solution: '',
        // 发起流程
        showFlow: false,
        temp: "",
        serverId: "",
        images: [],
        uploadUrl: ""
      }
    },
    methods: {
      selectHosp(hospId, hospName) {
        this.HospId = hospId;
        this.hospName = hospName;
        this.showHosp = false;
  
      },
      // 选择产品
      selectProduct() {
        this.showProduct = false;
        //设置名称
        this.strProduct = this.Product.map((item) => {
          return item;
        }).join(',')
      },
      selectUser(value) {
        console.log(value);
        this.contactUser = value;
        this.showUser = false;
      },
      //微信选择图片
      chooseImg() {
        var that = this;
        if (wx) {
          wxutils.chooseImg(wx, (localId, resServerId) => {
            //上传成功后,将文件显示到
            // console.log("选取本地图片地址:" + localId)
            that.serverId = resServerId;
            wxutils.getLocalImg(localId, function(imgData) {
              that.images.push({
                url: imgData
              });
            });
          })
        } else {
          this.$vux.toast.show({
            text: '请在微信中打开网页',
            type: "cancel"
          });
        }
      },
      removeImg: function() {
        this.images.shift();
        this.serverId = "";
      },
      prevImg: function(img) {
        wx.previewImage({
          current: img, // 当前显示图片的http链接
          // urls: [] // 需要预览的图片http链接列表
        });
      },
      chooseFile(e) {
        //显示加载的文件
        this.showfile = true;
        var _this = this;
        //获取加载后的文件
        var file = event.target.files[0];
        if (!file) {
          return false;
        }
        _this.attachFile = file;
        //读取上传的文件信息
        var reader = new FileReader();
        reader.onload = (evt) => {
          var temp = evt.target.result
          _this.imgPath = temp;
          _this.fileCount = 1;
        }
        var loaded = 0,
          total = file.size;
        //每次读取1M  
  
        reader.onprogress = (e) => {
          loaded += e.loaded;
          //更新进度条  
          var temp = (loaded / total) * 100;
        }
        reader.readAsDataURL(file);
      },
      //加载医院信息
      loadHosps() {
        this.showHosp = true;
        if (this.MyHosp.length == 0) {
          this.$http.get("Hospital/GetMyCSHosp").then((response) => {
            this.MyHosp = response.data;
          }, (error) => {
  
          })
        }
      },
      resultClick(item) {
  
        this.HospId = item.hospId;
        this.hospName = item.title;
        this.showHosp = false;
      },
      getResult(value) {
        //从hosp中查询数据
        this.$http.get("Hospital/GetHospByKey/" + value).then((success) => {
          var resData = success.data;
          //加载
          var tempData = resData.map((item) => {
            return {
              title: item.HospName,
              hospId: item.HospId
            }
          });
          this.result = tempData;
        })
  
  
      },
      // 加载产品信息
      loadProducts() {
        this.showProduct = true
        if (this.productList.length == 0) {
          this.$http.get("SysDict/产品线").then((response) => {
            this.productList = response.data.map((item) => {
              return item.DictName;
            });
          }, (error) => {
  
          })
        }
      },
      // 加载联系人
      loadUsers() {
        var hospId = this.HospId;
        this.showUser = true;
        console.log(hospId)
        if (hospId == 0) {
          //弹出错误提示
          this.$vux.toast.show({
            text: '请先选择医院信息',
            type: "cancel"
          });
          return false;
        }
        if (hospId != 0) {
          this.$http.get("CService/GetContactUsers/" + hospId).then((response) => {
            this.Users = response.data;
            console.log(response.data)
          }, (error) => {
  
          });
        }
      },
      clearForm() {
        this.HospId = 0;
        this.hospName = "";
        this.ReceiveTime = "";
        this.CompleteTime = "";
        this.dispNo = "";
        this.strProduct = "";
        this.contactUser = "";
        this.execMethod = ["现场处理"];
        this.productList = [];
        this.Users = [];
        this.category = ["故障报修"];
        this.fileCount = 0;
        this.solution = "";
        this.desc = "";
        this.attachFile = "";
        this.imgPath = '';
        this.showFlow = false;
        this.showfile = false;
      },
      // 获取formData;
      getFormData() {
        var postData = {
          "Category": this.category[0],
          "ContactUser": this.contactUser,
          "HospId": this.HospId,
          "ProblemDesc": this.desc,
          "Solution": this.solution,
          "ProductIds": this.strProduct,
          "ReceiveTime": this.ReceiveTime,
          "CompleteTime": this.CompleteTime,
          "ExecMethod": this.execMethod[0]
        };
  
        for (var key of Object.keys(postData)) {
          if (postData[key] == 0 || postData[key] == "") {
            console.log('key:' + key + "-value:" + postData[key]);
            return false;
          }
          console.log(key + ": " + postData[key]);
        }
        if (this.serverId) {
          postData["serverId"] = this.serverId;
        }
        return postData;
      },
      // 编辑信息保存
      saveData() {
        var formData = this.getFormData();
        console.log(formData);
        if (!formData) {
          this.$vux.toast.show({
            text: '请完善必填信息',
            type: "cancel"
          });
          return false;
        }
        var that = this;
        this.$http.post("CService/SaveRecord/" + this.dispNo, formData).then((response) => {
          that.$router.push({
            path: '/cservice'
          });
        }, (error) => {
  
        })
      },
      // 新增记录
      addData() {
        var formData = this.getFormData();
        if (!formData) {
          this.$vux.toast.show({
            text: '请完善必填信息',
            type: "cancel"
          });
          return false;
        }
        // 检查一下数据是否都有效
        var that = this;
        this.$http.post("CService/AddRecord", formData).then((response) => {
          this.$vux.toast.show({
            text: '新增成功',
            type: "ok"
          });
          //调整到指定页面
          that.$router.push({
            path: '/cservice'
          });
          // common.procResult(response,(resData)=>{
          // });
        }, (error) => {
  
        })
      },
      // 发起流程
      sendFlow() {
        var formData = {
          aa: '11',
          text: '11'
        };
        var postData = {
          WFNo: 'ccc019c9-0797-4288-bfa5-4f2e3ec0ff20',
          SourcePK: 'DE',
          FlowNo: '',
          FlowName: '流程标题',
          FlowJson: JSON.stringify(formData),
          FlowMemo: '备注嘻嘻你',
          FlowStatus: '0',
          SubUserId: '10685',
          ProcessUser: 10685,
          NextUser: '',
          NextStepNo: '',
          Comment: '我统一'
        }
        this.$http.post("WFlow/SaveForm", postData).then((success) => {
  
        }, (error) => {
  
        })
      },
      loadInfo() {
        var dispNo = this.$route.query.dispNo;
        if (!dispNo || dispNo == '') {
          //清空数据
          this.clearForm();
          return false;
        }
        this.showFlow = true;
        this.dispNo = dispNo;
        //加载基本信息
        this.$http.get("CService/GetRecordByNo/" + this.dispNo).then((res) => {
          var obj = res.data || undefined;
          if (!obj) {
            return false;
          }
          console.log(obj)
          this.ReceiveTime = obj.ReceiveTime;
          this.CompleteTime = obj.CompleteTime;
          this.HospId = obj.HoptalId;
          this.hospName = obj.HospName;
          this.strProduct = obj.ProductIds;
          this.contactUser = obj.ContactUser;
  
          var tempExec = [],
            tempCate = [];
          tempCate.push(obj.Category)
          this.category = tempCate;
          if (obj.ExecMethod == "CLFS0002") {
            this.execMethod = ["现场处理"]
          } else {
            this.execMethod = ["远程处理"]
          }
          this.solution = obj.Solution;
          this.desc = obj.ProblemDesc;
          if (obj.FileUrl.length > 0) {
            //替换 E:\PMIS_DOC
            var tempFile = obj.FileUrl.replace(/\\/g, "//");
            console.log(tempFile);
            var fileUrl = tempFile.replace(/E:/, "http://e.mdsd.cn:9000");
            console.log(fileUrl);
            this.imgPath = fileUrl;
            this.showfile = true;
            this.fileCount = 1;
          }
        }, () => {
  
        })
  
      }
    },
  
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.loadInfo();
      })
    },
    components: {
      XHeader,
      Cell,
      Tab,
      TabItem,
      Scroller,
      Datetime,
      Group,
      Popup,
      XButton,
      Checklist,
      Box,
      Radio,
      PopupPicker,
      Uploader,
      XTextarea,
      Selector,
      Search
    },
  }
</script>

<style type="text/less">
  li {
    list-style: none;
  }
  
  .popup {
    height: 100%;
    overflow: auto;
  }
  
  .weui_cell_bd {
    p {
      color: red;
    }
  }
</style>