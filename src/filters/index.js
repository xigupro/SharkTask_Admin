import moment from 'moment';
import Clients from '@/constants/clients';

export function filterBlank(val) {
  if (val === undefined || val === null || val === 'null' || val === '') {
    return '-';
  }
  return val;
}

export function fixMoney(val, count = 2) {
  if (val === undefined || val === null || val === 'null' || val === '' || Number.isNaN(Number(val))) {
    return 0;
  }
  return Number(val).toFixed(count);
}

export function transDate(val) {
  if (!val) {
    return '-';
  }
  const arr = val.split(' ');
  if (arr.length > 0) {
    return arr[0];
  }

  return '-';
}

export function millisecondToDate(val) {
  let time = parseFloat(val) / 1000;
  if (null != time && '' != time) {
    if (time > 60 && time < 60 * 60) {
      time =
        parseInt(time / 60.0) +
        '分钟' +
        parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) +
        '秒';
    } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time =
        parseInt(time / 3600.0) +
        '小时' +
        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) +
        '分钟' +
        parseInt(
          (parseFloat(
            (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60,
          ) -
            parseInt(
              (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60,
            )) *
            60,
        ) +
        '秒';
    } else {
      time = parseInt(time) + '秒';
    }
  }
  return time;
}

export function transLocalTime(val) {
  if (!val) {
    return '';
  }
  return moment(+val).format('YYYY/MM/DD HH:mm');
}

export function getQiniuFullUrl(val) {
  if (!val) {
    return '';
  } else if (/^(http|https):\/\/.+/.test(val)) {
    return val;
  }
  return window.API_CONFIG['qiniu_download'] + val;
}

export function getLoginType(val) {
  let from = '';
  // 登录方式。1微信；2账号密码；3短信；4苹果
  switch (val) {
    case 1:
      from = '微信';
      break;
    case 2:
      from = '账号密码';
      break;
    case 3:
      from = '短信';
      break;
    case 4:
      from = '苹果';
      break;
    default:
      console.info(val);
      break;
  }
  return from;
}

export function getCreatedFrom(val) {
  let from = '';
  switch (val) {
    case 2:
      from = '微信小程序';
      break;
    case 3:
      from = 'H5';
      break;
    case 4:
      from = '安卓';
      break;
    case 5:
      from = 'iOS';
      break;
    default:
      from = '后台管理';
      break;
  }
  return from;
}

export function toTenThousand(number) {
  if (!number) {
    return 0;
  }
  return (number/10000).toFixed(3);
}

export function transformClientName(key) {
  if (!key) {
    return '';
  }
  let result = [];
  const keyArray = key.split(',');
  keyArray.forEach((item) => {
    result.push(Clients[item]);
  });
  return result.join(',');
}