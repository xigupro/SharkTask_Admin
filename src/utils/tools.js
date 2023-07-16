import { getItem } from '@/utils/storage';

const CryptoJS = require('crypto-js');

// DES  ECB模式加密
export function encryptByDESModeEBC(message) {
  const key = window.API_CONFIG['key'];
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

// DES解密
export function decryptByDES(ciphertext) {
  const key = window.API_CONFIG['key'];
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// 加密
export const encryptedData = (data) => {
  if (!data) {
    return '';
  }
  const result = CryptoJS.MD5(`${data}1ef072259c8d1b925c08a7639cab6367_shark_task_2019`).toString();
  return result;
};

// 判断是否有权限访问页面，如只有第一个参数则为页面权限，有第二个参数则为功能权限，
export const checkAdminPower = (id, power) => {
  // 角色
  const userType = getItem('role');
  // 权限
  let powers = getItem('powers');
  let result = false;
  if (userType === '1') {
    // 超级管理员，拥有所有权限
    return true;
  }
  powers = powers && powers !== 'null' && powers !== 'undefined'
    ? JSON.parse(decodeURIComponent(powers)) : {};
  if (power) {
    // 判断功能权限
    result = powers[id][power] === '1';
  } else {
    // 判断页面权限
    for (const childKey in powers[id]) {
      if (powers[id][childKey] === '1') {
        // 只要有已勾选的，都可访问
        result = true;
      }
    }
  }
  return result;
};

// 生成随机字符串
export const randomString = (len = 32) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let str = '';
  let i = 0;
  while (i < len) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
    i += 1;
  }
  return str;
};
