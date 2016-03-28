$('#registermodal').on('shown.bs.modal', function() {
  $('#registername').focus();
});

$('#loginmodal').on('shown.bs.modal', function() {
  $('#loginname').focus();
});

function isNumber(toCheck) {
  var number = /[0-9]+$/;
  if (number.exec(toCheck))
    return true;
  return false;
}

function post(name) {
  var cardtype = document.getElementById(name + "cardtype").value;
  var number = document.getElementById(name + "number").value;
  var ok = true;
  if (cardtype == "") {
    alert("卡类型不能为空!");
    ok = false;
  }
  else if (number == "") {
    alert("卡号不能为空!");
    ok = false;
  }
  return ok;
}

function checkName(name) {
  var stname = /([a-z]|[A-Z]|_|[0-9])+$/;
  if (name == "") {
    alert("用户名不能为空!");
    return false;
  }
  else if (!stname.exec(name)) {
    alert("用户名只能由字母，数字，下划线构成!");
    return false;
  }
  return true;
}

function checkPsw(psw, pswconf) {
  if (psw == "") {
    alert("密码不能为空!");
    return false;
  }
  else if (psw.length < 6) {
    alert("密码太短了!至少为6位！");
    return false;
  }
  else if (pswconf != psw) {
    alert("两次输入密码不一致，请重新输入!");
    return false;
  }
  return true;
}

function checkContact(phone, QQ, email, address, college) {
  var stphone = /[\+]?([0-9]{3,4}[-])?[0-9]+$/;
  if (phone == "" && QQ == "" && email == "" && address == "" && college == "") {
    alert("至少留个联系方式吧！手机、QQ、email、地址、学院都可以呢！");
    return false;
  }
  else if (phone != "" && !stphone.exec(phone)) {
    alert("电话号码格式不正确! 比如+86123456或者010-123456!");
    return false;
  }
  else if (QQ != "" && !isNumber(QQ)) {
    alert("QQ号码格式不正确! 应全为数字!");
    return false;
  }
  return true;
}

function check(type) {
  var name, psw, pswconf, phone, QQ, email, address, college;
  
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
  else if (type == 'login') { // OK
    name = document.getElementById(type + 'name').value;
    if (!checkName(name))
      return false;
  }
  else if (type == 'edit') { // OK
    phone = document.getElementById(type + 'phone').value;
    QQ = document.getElementById(type + 'QQ').value;
    email = document.getElementById(type + 'email').value;
    address = document.getElementById(type + 'adr').value;
    college = document.getElementById(type + 'college').value;    
    if (!checkContact(phone, QQ, email, address, college))
      return false;
  }
  else if (type == 'update') { // Ok
    psw = document.getElementById(type + 'psw').value;
    pswconf = document.getElementById(type + 'pswconf').value;
    if (!checkPsw(psw, pswconf))
      return false;
  }
  return true;
};