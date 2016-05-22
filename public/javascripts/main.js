// 注册模态框弹出时，光标锁定位置
$('#registermodal').on('shown.bs.modal', function() {
  $('#registername').focus();
});

// 登录模态框弹出时，光标锁定位置
$('#loginmodal').on('shown.bs.modal', function() {
  $('#loginname').focus();
});

// 数字检测
function isNumber(toCheck) {
  var number = /[0-9]+$/;
  if (number.exec(toCheck))
    return true;
  return false;
}

// 发布信息规则检测
function post(name) {
  // 获取卡类型和卡号
  var cardtype = document.getElementById(name + "cardtype").value;
  var number = document.getElementById(name + "number").value;
  // 检测是否合格
  var ok = true;
  // 卡类型不为空
  if (cardtype == "") {
    alert("卡类型不能为空!");
    ok = false;
  }
  // 卡号不为空
  else if (number == "") {
    alert("卡号不能为空!");
    ok = false;
  }
  return ok;
}

// 用户名规则检测
function checkName(name) {
  // 定义用户名正则式
  var stname = /([a-z]|[A-Z]|_|[0-9])+$/;
  // 用户名不为空
  if (name == "") {
    alert("用户名不能为空!");
    return false;
  }
  // 匹配正则式失败
  else if (!stname.exec(name)) {
    alert("用户名只能由字母，数字，下划线构成!");
    return false;
  }
  return true;
}

// 密码规则检测
function checkPsw(psw, pswconf) {
  // 密码不为空
  if (psw == "") {
    alert("密码不能为空!");
    return false;
  }
  // 密码长度检测
  else if (psw.length < 6) {
    alert("密码太短了!至少为6位！");
    return false;
  }
  // 密码确认和密码不匹配
  else if (pswconf != psw) {
    alert("两次输入密码不一致，请重新输入!");
    return false;
  }
  return true;
}

// 联系方式规则检测
function checkContact(phone, QQ, email, address, college) {
  // 手机号码正则式
  var stphone = /[\+]?([0-9]{3,4}[-])?[0-9]+$/;
  // 联系方式不可均为空
  if (phone == "" && QQ == "" && email == "" && address == "" && college == "") {
    alert("至少留个联系方式吧！手机、QQ、email、地址、学院都可以呢！");
    return false;
  }
  // 电话号码规则检测
  else if (phone != "" && !stphone.exec(phone)) {
    alert("电话号码格式不正确! 比如+86123456或者010-123456!");
    return false;
  }
  // QQ号码规则检测
  else if (QQ != "" && !isNumber(QQ)) {
    alert("QQ号码格式不正确! 应全为数字!");
    return false;
  }
  return true;
}

// 检测函数
function check(type) {
  var name, psw, pswconf, phone, QQ, email, address, college;
  
  // 注册检测
  if (type == 'register') { // OK
    name = document.getElementById(type + 'name').value;
    if (!checkName(name))
      return false;
    psw = document.getElementById(type + 'psw').value;
    pswconf = document.getElementById(type + 'pswconf').value;
    if (!checkPsw(psw, pswconf))
      return false;
    phone = document.getElementById(type + 'phone').value;
    QQ = document.getElementById(type + 'QQ').value;
    email = document.getElementById(type + 'email').value;
    address = document.getElementById(type + 'adr').value;
    college = document.getElementById(type + 'college').value;    
    if (!checkContact(phone, QQ, email, address, college))
      return false;
  }
  // 登录检测
  else if (type == 'login') { // OK
    name = document.getElementById(type + 'name').value;
    if (!checkName(name))
      return false;
  }
  // 修改信息检测
  else if (type == 'edit') { // OK
    phone = document.getElementById(type + 'phone').value;
    QQ = document.getElementById(type + 'QQ').value;
    email = document.getElementById(type + 'email').value;
    address = document.getElementById(type + 'adr').value;
    college = document.getElementById(type + 'college').value;    
    if (!checkContact(phone, QQ, email, address, college))
      return false;
  }
  // 更新信息检测
  else if (type == 'update') { // Ok
    psw = document.getElementById(type + 'psw').value;
    pswconf = document.getElementById(type + 'pswconf').value;
    if (!checkPsw(psw, pswconf))
      return false;
  }
  return true;
};