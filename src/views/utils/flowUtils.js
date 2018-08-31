

function FlowUtils(option, ajaxHelper) {
    this.opts = options(option);
    // 加载下一步签核人
    this.showNextUser = showNextUser;
    // 加载签核过程
    this.showProcess = showProcess;
    // 执行签核
    this.execFlow = execFlow;
    // 审批
    this.approve = approve;
    // 拒绝
    this.reject = reject;
    // 转交
    this.deliver = deliver;
    // 请求服务器
    this.ajaxHelper = ajaxHelper;
    // 加载表单信息
    this.loadForm = loadForm;
}
'use strict'
// 0：可配参数
function options(param) {
    var opts = {
        URL: {
            showUsers: "",
            load: "",
            process: "",
            exec: "",
        },
        instNo: param["FlowNo"],
        postData: {
            // 流程类别
            WFNo: "",
            // 来源（第三方的流程）
            SourcePK: "",
            // 流程编号（主键guid）
            FlowNo: param["FlowNo"],
            // 流程标题
            FlowName: "",
            // 流程表单对象
            FlowJson: "",
            // 流程处理人
            ProcessUser: "",
            // 下一步骤
            NextStepNo: "",
            // 下一处理人（签核必填）
            NextUser: [],
            // 意见
            Comment: "",
            // 当前步骤编号
            StepNo: "",
            // 流程当前步骤名称
            StepName: "",
            // 附件信息
            AttachFiles: ""
        }
    }
    if (!param) return opts;
    else {
        Object.keys(param).forEach(key => {
            opts.postData[key] = param[key];
        });
        if (!opts["instNo"]) {
            opts.instNo = param["FlowNo"];
        }
    }
    return opts;
}

// 1:加载下一步处理人
function showNextUser(userData, error) {
    var url = this.opts.URL.showUsers || "WFlow/GetFlowNextUser";

    this.ajaxHelper.post(url, this.opts.postData).then(function (res) {
        if (typeof (userData) == "function") {
            userData(res.data);
        }
    }, function (error) {
        if (typeof (error) == "function") {
            error(error);
        }
    });
}

// 2:加载下一步签核人
function showProcess(processData, error) {
    if (this.opts.instNo) {
        var url = this.opts.URL.showUsers || "QueryFlow/GetApproveRecord/" + this.opts.instNo;
        this.ajaxHelper.get(url).then(function (res) {
            if (typeof (processData) == "function") {
                processData(res.data);
            }
        }, function (error) {
            if (typeof (error) == "function") {
                error(error);
            }
        });
    }
}

// 3：执行审批流
// obj 是选择的下一步人员和下一步
function execFlow(success) {
    var url = this.opts.URL.exec || "WFlow/ApproveFlow";
    // 设置下一步和下一处理人
    console.log(this.opts.postData)
    this.ajaxHelper.post(url, this.opts.postData).then(function (res) {
        console.log("加载签核过程,返回成功");
        if (typeof (success) == "function") {
            success(res.data);
        }
    }, function (error) {
        if (typeof (error) == "function") {
            error(error);
        }
    });
}



// 4：签核
function approve() {
    // 加载
}

// 5：驳回
function reject(success) {
    //加载审批人
    var url = this.opts.URL.reject || "WFlow/RejectFlow";
    // 设置下一步和下一处理人
    this.ajaxHelper.post(url, this.opts.postData).then(function (res) {
        if (typeof (success) == "function") {
            success(res.data);
        }
    }, function (error) {
        if (typeof (error) == "function") {
            error(error);
        }
    });
}

// 6：加载流程表单信息
function loadForm(formData, errFunc) {
    var url = this.opts.URL.load || "QueryFlow/GetFlowByNo/" + this.opts.instNo;
    this.ajaxHelper.get(url).then(function (res) {
        // console.log("加载表单信息,返回成功");
        if (typeof (formData) == "function") {
            formData(res.data);
        }
    }, (error) => {
        if (typeof (errFuncformData) == "function") {
            errFunc(res.data);
        }
    });
}

// 6：转交
function deliver() {

}

export default FlowUtils;