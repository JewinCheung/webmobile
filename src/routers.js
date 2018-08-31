'use strict'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './views/Index'
import E404 from './views/404'

import Project from './views/project/Index.vue'
import ProjectInfo from './views/project/ProjectInfo.vue'
import UpFile from './views/project/UpFile.vue'

import WorkLog from './views/worklog/Index.vue'
import LogInfo from './views/worklog/LogInfo.vue'
import LogDetail from './views/worklog/LogDetail.vue'

import CService from './views/cservice/Index.vue'
import NewCSWork from './views/cservice/NewCSWork.vue'
import WorkFlow from './views/workflow/Index.vue'
import Approve from './views/workflow/approve.vue'
import DefaultForm from './views/workflow/form/FormDefault'

import Notice from './views/notice/Index.vue'
import Known from './views/known/Index.vue'
import vote from './views/vote/Index.vue'



import FormInfo from './views/workflow/form/FormInfo'
import FormAction from './views/workflow/form/FormAction'
import AttachFiles from './views/workflow/form/AttachFiles'


const routes = [{//首页
    path: '/',
    name: 'Index',
    meta: {
        requireAuth: false,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: Index
}, {//首页
    path: '/Index',
    name: 'index',
    component: Index,
    meta: {
        requireAuth: false
    }
}, {//404
    path: '/404',
    name: '404',
    component: E404,
},
{    // 登陆页面
    path: '/login',
    name: 'login',
    component: require('./views/Login')

}, {//流程
    path: '/workflow',
    name: 'workflow',
    component: WorkFlow,
    meta: {
        requireAuth: true
    }
},
{  // 项目
    path: '/Project',
    name: 'Project',
    component: Project,
    meta: {
        requireAuth: true
    }
},
{//项目详情
    path: '/project/projectinfo/:id',
    name: 'proinfo',
    component: ProjectInfo,
    meta: {
        requireAuth: true
    }
},
{//上传文档
    path: '/project/upfile/:id',
    name: 'upfile',
    component: UpFile,
    meta: {
        requireAuth: true
    }
},
{//客服首页
    path: '/cservice',
    name: 'cservice',
    component: CService,
    meta: {
        requireAuth: true
    }

},
{//工作任务
    path: '/cservice/newcswork',
    name: 'newcswork',
    component: NewCSWork,
    meta: {
        requireAuth: true
    }

},
{//工作日志
    path: '/worklog',
    name: 'worklog',
    component: WorkLog,
    meta: {
        requireAuth: true
    }

},
{//日志详情
    path: '/worklog/loginfo/:date',
    name: 'loginfo',
    component: LogInfo,
    meta: {
        requireAuth: true
    }

},
{//添加日志
    path: '/worklog/logdetail',
    name: 'logdetail',
    component: LogDetail,
    meta: {
        requireAuth: true
    }

},
{//公告
    path: '/notice',
    name: 'notice',
    component: Notice,
    meta: {
        requireAuth: true
    }

},
{//公告
    path: '/notice/noticeinfo/:no',
    name: 'noticeinfo',
    component: require('./views/notice/NoticeInfo'),
    meta: {
        requireAuth: true
    }

},
{//知识
    path: '/known',
    name: 'known',
    component: Known,
    meta: {
        requireAuth: true
    }

},
{//投票
    path: '/vote/:tourl',
    name: 'vote',
    component: vote,
    meta: {
        requireAuth: true
    }

},
{
    path: '/SignInfo/:voteid/:vstatus',
    name: 'SignInfo', 
    component: require("./views/vote/SignInfo.vue"),
    meta: {
        requireAuth: true
    }

},

{
    path: '/VoteItemToText/:voteid/:vstatus',
    name: 'VoteItemToText', 
    component: require("./views/vote/VoteItemToText.vue"),
    meta: {
        requireAuth: true
    }

},
{
    path: '/VoteItemToImg/:voteid/:vstatus',
    name: 'VoteItemToImg', 
    component: require("./views/vote/VoteItemToImg.vue"),
    meta: {
        requireAuth: true
    }

},
{//流程报错页
    path: '/defaultForm',
    name: 'defaultForm',
    component: DefaultForm,

},
{//流程详情
    path: '/workflow/approve',
    name: 'approve',
    component: Approve,
    meta: {
        requireAuth: true
    },
    children: [
        {
            path: '/formInfo', name: 'formInfo', component: FormInfo,
            children: [
                // { path: '/defaultForm', name: 'defaultForm', component: DefaultForm },
                //=============Admin
                { path: '/formLog', name: 'formLog', component: require("./views/workflow/form/Admin/FormLog.vue") },

                //=============客服系统 CService
                //客服回访工作流
                { path: '/formBackvisit', name: 'formBackvisit', component: require("./views/workflow/form/CService/FormBackvisit.vue") },
                //售后纸质文档回寄流程
                { path: '/formCSBackdoc', name: 'formCSBackdoc', component: require("./views/workflow/form/CService/FormCSBackdoc.vue") },
                //售后医院服务总结报告申请
                { path: '/formCSSummary', name: 'formCSSummary', component: require("./views/workflow/form/CService/FormCSSummary.vue") },
                //售后医院客服工程师申请变更流程
                { path: '/formCSUserChange', name: 'formCSUserChange', component: require("./views/workflow/form/CService/FormCSUserChange.vue") },
                //客服巡检
                { path: '/formInspback', name: 'formInspback', component: require("./views/workflow/form/CService/FormInspback.vue") },
                //售后客户化流程
                { path: '/formCSDemand', name: 'formCSDemand', component: require("./views/workflow/form/CService/FormCSDemand.vue") },


                //=============OA
                //资质原件申请
                { path: '/formBusinessCard', name: 'formBusinessCard', component: require("./views/workflow/form/OA/FormBusinessCard.vue") },
                //办公大楼维修流程
                { path: '/formEngineering', name: 'formEngineering', component: require("./views/workflow/form/OA/FormEngineering.vue") },
                //财务数据资料申请
                { path: '/formFinancialData', name: 'formFinancialData', component: require("./views/workflow/form/OA/FormFinancialData.vue") },
                //发票申请流程
                { path: '/formInvoiceApply', name: 'formInvoiceApply', component: require("./views/workflow/form/OA/FormInvoiceApply.vue") },
                //公告发布流程
                { path: '/formNotice', name: 'formNotice', component: require("./views/workflow/form/OA/FormNotice.vue") },
                //办公用品申请流程
                { path: '/formOfficeApply', name: 'formOfficeApply', component: require("./views/workflow/form/OA/FormOfficeApply.vue") },
                //办公设备维修流程
                { path: '/formOfficeRepair', name: 'formOfficeRepair', component: require("./views/workflow/form/OA/FormOfficeRepair.vue") },
                //公章使用申请流程
                { path: '/formOfficialSeal', name: 'formOfficialSeal', component: require("./views/workflow/form/OA/FormOfficialSeal.vue") },
                //项目授权函申请流程
                { path: '/formProAuth', name: 'formProAuth', component: require("./views/workflow/form/OA/FormProAuth.vue") },
                //资质原件申请
                { path: '/formQFOriginal', name: 'formQFOriginal', component: require("./views/workflow/form/OA/FormQFOriginal.vue") },
                //人员外出登记流程
                { path: '/formOutRecord', name: 'formOutRecord', component: require("./views/workflow/form/OA/FormOutRecord.vue") },
                //会议室预约申请
                { path: '/formRoomApply', name: 'formRoomApply', component: require("./views/workflow/form/OA/FormRoomApply.vue") },
                //办公系统需求申请
                { path: '/formOAUR', name: 'formOAUR', component: require("./views/workflow/form/OA/FormOAUR.vue") },
                //无合同入场申请
                { path: '/formNoContractApply', name: 'formNoContractApply', component: require("./views/workflow/form/OA/FormNoContractApply.vue") },
                //无合同申请评估
                { path: '/formEvaluateApply', name: 'formEvaluateApply', component: require("./views/workflow/form/OA/FormEvaluateApply.vue") },
                //固定资产报废
                { path: '/formScrapApply', name: 'formScrapApply', component: require("./views/workflow/form/OA/FormScrapApply.vue") },
                //积分申请流程
                { path: '/formIntegralApply', name: 'formIntegralApply', component: require("./views/workflow/form/OA/FormIntegralApply.vue") },
                  //招聘申请流程
                { path: '/formRecruitApply', name: 'formRecruitApply', component: require("./views/workflow/form/OA/FormRecruitApply.vue") },
                //销售合同作废流程
                { path: '/formCancelContract', name: 'formCancelContract', component: require("./views/workflow/form/OA/FormCancelContract.vue") },
                //信息屏发布申请
                { path: '/formPublishApply', name: 'formPublishApply', component: require("./views/workflow/form/OA/FormPublishApply.vue") },
                
                
                
                //=============Project
                //项目作废申请流程
                { path: '/formCancelProject', name: 'formCancelProject', component: require("./views/workflow/form/Project/FormCancelProject.vue") },
                //数据线等用品领用
                { path: '/formDataLine', name: 'formDataLine', component: require("./views/workflow/form/Project/FormDataLine.vue") },
                //加密狗申请流程
                { path: '/formEncryptedDog', name: 'formEncryptedDog', component: require("./views/workflow/form/Project/FormEncryptedDog.vue") },
                //项目纸质文档流程
                { path: '/formPaperExpress', name: 'formPaperExpress', component: require("./views/workflow/form/Project/FormPaperExpress.vue") },
                //项目经理变更流程
                { path: '/formPManagerChage', name: 'formPManagerChage', component: require("./views/workflow/form/Project/FormPManagerChage.vue") },
                //项目出差流程
                { path: '/formProAway', name: 'formProAway', component: require("./views/workflow/form/Project/FormProAway.vue") },
                //费用报销
                { path: '/formProExpense', name: 'formProExpense', component: require("./views/workflow/form/Project/FormProExpense.vue") },
                //合同拆分
                { path: '/formSplitContract', name: 'formSplitContract', component: require("./views/workflow/form/Project/FormSplitContract.vue") },
                //临时撤场流程
                { path: '/formTempleave', name: 'formTempleave', component: require("./views/workflow/form/Project/FormTempleave.vue") },
                //实施晋级申请流程
                { path: '/formUserGrading', name: 'formUserGrading', component: require("./views/workflow/form/Project/FormUserGrading.vue") },
                //合同拆分同步NC
                { path: '/formSyncProToNC', name: 'formSyncProToNC', component: require("./views/workflow/form/Project/FormSyncProToNC.vue") },

                //=============Pur
                //非项目采购申请
                { path: '/formItempick', name: 'formItempick', component: require("./views/workflow/form/Pur/FormItempick.vue") },
                //项目采购申请
                { path: '/formPurApply', name: 'formPurApply', component: require("./views/workflow/form/Pur/FormPurApply.vue") },
                //项目采购变更申请
                { path: '/formPurChange', name: 'formPurChange', component: require("./views/workflow/form/Pur/FormPurChange.vue") },
                //项目采购赠送申请
                { path: '/formPurGiving', name: 'formPurGiving', component: require("./views/workflow/form/Pur/FormPurGiving.vue") },
                //策略采购申请流程
                { path: '/formTacticsPurchase', name: 'formTacticsPurchase', component: require("./views/workflow/form/Pur/FormTacticsPurchase.vue") },


                //=============WFlow
                //研发客户化流程
                { path: '/formDemand', name: 'formDemand', component: require("./views/workflow/form/WFlow/FormDemand.vue") },
                //Wiicare测试流程
                { path: '/formWiicareTest', name: 'formWiicareTest', component: require("./views/workflow/form/WFlow/FormWiicareTest.vue") },
                //Wiicare需求流程
                { path: '/formWiicareUr', name: 'formWiicareUr', component: require("./views/workflow/form/WFlow/FormWiicareUr.vue") },
                //mWiicare产品反馈
                { path: '/formWiicareProduct', name: 'formWiicareProduct', component: require("./views/workflow/form/WFlow/FormWiicareProduct.vue") },


            ]
        },
        { path: '/formAction/:type', name: 'formAction', component: FormAction },
        { path: '/attachFiles', name: 'attachFiles', component: AttachFiles }
    ]


},


/* 404路由 */
{
    path: '*',
    redirect: '/404'
}

]
export default new VueRouter({
    routes
}) 
