import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/assets/iconfont/iconfont.css'
import '@/permission' // permission control
// openapi调用，访问地址是网关
import OPENAPIrequest from '@/utils/APIRequest'

import { getParams } from '@/api/openapi'
// 非openapi调用
import request from '@/utils/request'
import API from '@/api/api'

Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {
    var operators, result;
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    result = operators[operator](lvalue, rvalue); 
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

{{#if isElement}}
import ElementUI from 'element-ui'
import '@/assets/theme/index.css'
{{/if}}
{{#if multi}}
const multi = true
{{/if}}
{{#if stor}}
// 青云oss
import $QStor from '@/utils/QingStor'
window.$QStor = $QStor
window.$QStor.storConfig = {
   host: {{storConfig.host}},
   port: {{storConfig.port}},
   protocol: {{storConfig.protocol}},
   access_key_id: {{storConfig.access_key_id}},
   secret_access_key: {{storConfig.secret_access_key}},
   bucket: {{storConfig.bucket}},
   zone: {{storConfig.zone}}
}
{{/if}}
{{#compare openapi "===" "0"}}
const openAPI = true
{{else}}
const openAPI = false
{{/compare}}
{{#if editor}}
const editor = true
{{/if}}
import './filters'
import './mixins'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
// import 'babel-polyfill'
Vue.use(ElementUI)

Vue.config.productionTip = false

function APIRequest(apiId, data) {
  const apiParams = getParams(apiId)
  if (apiParams) {
    const requestData = {
      data: data,
      id: apiId
    }
    return OPENAPIrequest(requestData)
  }
}

window.$httpRequest = APIRequest

function http(url, method, data) {
  const params = {
    url, method,
    data
  }
  return request(params)
}

window.$HTTP = http

function httpRequest(api, method, data) {
  const apiParams = API[api]
  if (apiParams) {
    const requestData = {
      data: data,
      id: api
    }
    return OPENAPIrequest(requestData)
  }
}

window.$httpRequest = httpRequest



new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
