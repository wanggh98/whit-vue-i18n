import message from './message';
import axios from 'axios'
import api from './api'
// dev
export const httpUrl = 'https://passport.dev.langmeta.com'
export const target = 'https://rigel.dev.langmeta.com'
export const client_id = '7b56e641dab245a5a8d0a3ec639bf371'
export const appid = 'wx8927ebd52d815163'

// 生产
// export const httpUrl = 'https://passport.welhow.com'
// export const target = 'https://rigel.welhow.com'
// export const client_id = '7b56e641dab245a5a8d0a3ec639bf371'
// export const appid = 'wx7b198c58d88fe2f4'

// 静态常量
export const baseUrl = '/design'
export const weChatOAuthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&response_type=code&scope=snsapi_userinfo&state=STATE&redirect_uri=';
export const redirect_uri = httpUrl + '/oauth/authorize?client_id=' + client_id + '&response_type=code&authentication_mode=wechat_official_code&scope=base&redirect_uri='
export const backUrl = encodeURI(location.origin )//+'/work-manager/create'

let timeout = 1800;
let RETRY = 5;
let isFefresh = false;
// 发起请求
export const $request = async function (obj, retry = 0) {
  if (!obj.url) {
    console.error('请检查url参数',obj)
    return Promise.reject('请检查url参数')
  }
  return new Promise((resolve, reject) => {

    let token = localStorage.getItem('token');
    let headerObj = {
      "content-type":"application/json"
    }
    let headers = obj.header || obj.headers || headerObj;
    headers["Authorization"] = token;
    //headers['Referer'] = '1111111111.langmeta.com';
    console.log('obj::::',obj)
    let option = {
      url: (obj.baseUrl || baseUrl) + obj.url,
      data: obj.data || '',
      params: obj.data || '',
      method: obj.method || 'get',
      headers,
      withCredentials:true,
      responseType: obj.responseType || 'text',
    }
    if (option.method == 'get') {
      delete option.data
    } else {
      delete option.params
    }
    axios(option).then( res => {
      if (isFefresh) {
        isFefresh = false;
      }
      console.log(res)
      resolve(res.data)
    }, err => {
      if (err.response.status == 500) {

        message.error('服务器异常，请稍后重试')
          reject(err);
      } else if (err.response.status == 401) {
        if (retry < RETRY) {
          console.info('refresh: ', retry);
          if (!localStorage.getItem('refresh_token')) {
            if (token) {
              // clearCookie()
              localStorage.clear()
              sessionStorage.clear()
              message.error('登录信息已过期，请重新登录!');
            }
            if (obj.state) {
              location.href = httpUrl+'/oauth/authorize?client_id='+client_id+'&response_type=code&scope=base&redirect_uri='+backUrl + '&state='+obj.state
            } else {
              location.href = httpUrl+'/oauth/authorize?client_id='+client_id+'&response_type=code&scope=base&redirect_uri='+backUrl
            }
          } else {
            return refresh(obj, retry + 1,resolve, reject);
          }
        } else {
          message.error('服务器异常')
           reject('服务器异常')
        }
      } else {
        message.error(err.response.data.message || '服务器异常')
        reject(err);
      }
      console.dir(err)
      // message.error(obj.errMsg || '网络异常,请检查网络')
      //  reject(err)
    });
  });
}

export function refresh(opts,retry = 0, resolve, reject) {
  console.log('isFefresh',localStorage.getItem('refresh_token'))
  if (!isFefresh) {
      let refresh_token = localStorage.getItem('refresh_token') || '';
      if (refresh_token && refresh_token !== '') {
        isFefresh = true;
        return resolve(axios({
          url: baseUrl + api.refreshToken,
          data:{
            refresh_token
          },
          method:'post'
        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            let data = res.data.data
            localStorage.setItem('refresh_token',data.token_type + ' ' + data.refresh_token);
            localStorage.setItem('token',data.token_type + ' ' + data.access_token);
            return $request(opts,retry)
          } else {
            message.error('登录信息已过期，请重新登录!');
            // clearCookie();
            localStorage.clear()
            sessionStorage.clear()
            // getToken(retry,opts,resolve, reject)
              setTimeout(() => {
                if (opts.state) {
                  location.href = httpUrl+'/oauth/authorize?client_id='+client_id+'&response_type=code&scope=base&redirect_uri='+backUrl + '&state='+opts.state
                } else {
                  location.href = httpUrl+'/oauth/authorize?client_id='+client_id+'&response_type=code&scope=base&redirect_uri='+backUrl
                }
              },1200)
            if(reject) {
              return reject({msg: '登录信息已过期，请重新登录!'});
            }
          }
        },err => {
          message.error('登录信息已过期，请重新登录!');
          // clearCookie();
          localStorage.clear()
          sessionStorage.clear()
          // getToken(retry,opts,resolve, reject)
            setTimeout(() => {
              if (opts.state) {
                location.href = httpUrl+'/oauth/authorize?client_id='+client_id+'&response_type=code&scope=base&redirect_uri='+backUrl + '&state='+opts.state
              } else {
                location.href = httpUrl+'/oauth/authorize?client_id='+client_id+'&response_type=code&scope=base&redirect_uri='+backUrl
              }
            },1200)
          if(reject) {
            return reject(err);
          }
        }))

      } else {
        // clearCookie();
        localStorage.clear()
        sessionStorage.clear()
         message.error('登录信息已过期，请重新登录!');
          setTimeout(() => {
            if (opts.state) {
              location.href = httpUrl+'/oauth/authorize?client_id='+client_id+'&response_type=code&scope=base&redirect_uri='+backUrl + '&state='+opts.state
            } else {
              location.href = httpUrl+'/oauth/authorize?client_id='+client_id+'&response_type=code&scope=base&redirect_uri='+backUrl
            }
          }, 1200);
          if (reject) {
             return reject({msg: '登录信息已过期，请重新登录!'});
          }
        // 登录页面
        isFefresh = false;
    }
  } else {
    setTimeout(()=>{
      let token = localStorage.getItem('token');
      if (token) {
        if (resolve) {
          return resolve($request(opts,retry));
        } else {
          return $request(opts,retry)
        }
      }
    },1000)

  }
}
