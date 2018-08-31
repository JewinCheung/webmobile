<template>
  <div class="page upfile">
    <div class="weui_tab_bd">
      <group title="上传文档">
        <popup-picker title="文档类型" :data="docTypeList" v-model="docType"></popup-picker>
        <datetime v-model="docDate" format="YYYY-MM-DD" title="签字日期" confirm-text="完成" cancel-text="取消"></datetime>
  
        <!--<uploader slot="after-title" :count="fileCount" :maxlength="1" @select-file="chooseImg">
  										<span slot="title">文件上传</span>
  										<uploader-files slot="uploader-files" v-show="showfile" :image-url="imgPath">
  										</uploader-files>
  									</uploader>-->
        <uploader :images="images" title="上传图片" :handle-click="true" :show-header="true" :readonly="false" :upload-url="uploadUrl" size="small" @preview="prevImg" @remove-image="removeImg" @add-image="chooseImg"></uploader>
        <x-textarea :max="200" :row="6" :height="150" v-model="memo" placeholder="文档备注信息"></x-textarea>
        <box gap="10px 10px">
          <x-button @click.native="saveProDoc" type="primary">
            上传文档
          </x-button>
        </box>
      </group>
      <div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Group,
    Cell,
    PopupPicker,
    Picker,
    Datetime,
    XTextarea,
    Box,
    XButton
  } from 'vux'
  // import { Uploader, UploaderFiles, UploaderFile } from '../../components';
  import Uploader from 'vux-uploader'
  import common from '../utils/common';
  import wxutils from '../utils/wxUtils'
  export default {
    name: 'upfile',
    components: {
      Cell,
      Group,
      PopupPicker,
      Picker,
      Datetime,
      XTextarea,
      Uploader,
      Box,
      XButton,
    },
    data() {
      return {
        ProjectCode: '',
        docTypeList: [
          ["无"]
        ],
        docType: ["无"],
        docList: [],
        docDate: '',
        memo: '',
        // 文件上传涉及的变量
        // showfile: false,
        imgPath: '',
        serverId: '',
        images: [],
        StageNo: '',
        uploadUrl: ""
      }
    },
    methods: {
      loadDocs() {
        var url = "SysDict/项目文档";
        var _this = this;
  
        // if (_this.docTypeList[0].length > 0) {
        // 	return false;
        // }
        //调用远程,加载该项目的基本信息i
        _this.$http.get(url).then((success) => {
          var doclist = success.data;
          if (doclist.length == 0) {
            return false;
          }
  
          var tempList = doclist.filter((item) => {
            if (item.DictParam.length > 10) {
              var curStageCode = JSON.parse(item.DictParam).StageCode;
              return curStageCode == _this.StageNo
            } else {
              return false;
            }
          }).map((item) => {
            return item.DictName;
          });
  
          tempList.forEach(u => {
            _this.docTypeList[0].push(u);
          })
          // _this.docTypeList=[tempList];
        });
      },
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
      //上传验收报告
      saveProDoc() {
        var postData = {
          "projectCode": this.ProjectCode,
          "docName": this.docType[0],
          "docDate": this.docDate,
          "memo": this.memo,
          "wxFileId": this.serverId
        };
        if (postData.docName == "无") {
          this.$vux.toast.show({
            text: '请选择文档类型',
            type: "cancel"
          });
          return false;
        }
        //检查必填项是否都有填写
        var isOk = common.checkPostData({
          "docName": this.docType[0],
          "docDate": this.docDate,
          "wxFileId": this.serverId
        });
        if (isOk) {
          this.$vux.toast.show({
            text: '请填写必填项',
            type: "cancel"
          });
          return false;
        }
        var that = this;
        // POST /someUrl
        that.$http.post("Project/UpProjectFile", postData).then((response) => {
          //提示保存成功
          that.$vux.toast.show({
            text: '文件上传成功,请等待审核',
            type: "ok"
          });
          that.docType = ["无"];
          that.docDate = "";
          that.memo = "";
          //清空已经填写的内容
          that.imgPath = "";
          that.fileCount = 0;
          that.showfile = false;
          //重新加载文档信息
          that.loadDocList();
        });
      },
      backIndex() {
        this.$router.push("/project")
      },
  
    },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.ProjectCode = to.params.id;
        vm.StageNo = to.query.stageNo;
        vm.loadDocs()
      })
    },
  
  
    // watch: {
    // 	'$route': function (to, from) {
    // 		// console.log("11");
    // 		this.ProjectCode = this.$route.params.id;
    // 		this.StageNo = this.$route.query.stageNo;
    // 		//加载基本信息
    // 		this.loadDocs()
    // 	}
  
    // },
  }
</script>


<style scoped>
  .subdb {
    padding-bottom: 40px;
  }
</style>