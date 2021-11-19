//constructor

function Validator(options) {

    var selectorRules = {}; //undefined

    //hàm thực hiện validate
    function validate(inputElement, rule) {
        //value: inputElement.value
        //test func: rule.test
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        //lấy ra các rule của selector
        var rules = selectorRules[rule.selector];
        
        //lặp qua từng rule và check 
        //nếu có lỗi thì dừng việc kiểm tra
        for(var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }
        
        if(errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    };

    var formElement = document.querySelector(options.form);

    //khi submit form
    formElement.onsubmit = function(e) {
        e.preventDefault();
        var isValidForm = true;

        //lặp qua từng rule và validate
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector);
            var isValid = validate(inputElement, rule);
            if(!isValid) {
                isValidForm = false;
            }
        });
        
        if(isValidForm) {
            //submit voi JS
            if(typeof options.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                var formValues = Array.from(enableInputs).reduce(function(values, input) {
                    values[input.name] = input.value;
                    return values;
                }, {});
                options.onSubmit(formValues);
            }
            //submit voi HTML (default submit)
            else {
                formElement.submit();
            }
        }
    }

    //lặp qua các rule của form
    if(formElement) {
        options.rules.forEach(function(rule) {

            //lưu lại các rule cho mỗi input
            if(selectorRules[rule.selector] != undefined) { //~ Array.isArray(selectorRules[rule.selector])
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement) {
                //khi blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }
                //khi người dùng nhập
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
};

//rules
//nguyên tắc của các rule
//1. khi có lỗi => trả mess lỗi
//2. khi không lỗi => không trả gì cả (undefined)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập nội dung';
        },
    }
};

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailPattern.test(value) ? undefined : message || 'Email không hợp lệ.';
        },
    }
};

Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        },
    }
};

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không trùng khớp';
        }
    }
}

// Validator.isConfirmed = function(selector, compare) {
//     var formElement = document.querySelector(options.form);
//     if( formElement.querySelector(compare).value = 
//     formElement.querySelector(selector).value) {
//         console.log('true');
//     } else {
//         console.log('false');
//     }
//     //     if (document.getElementById('password').value ==
//     //       document.getElementById('confirm_password').value) {
//     //       document.getElementById('message').style.color = 'green';
//     //       document.getElementById('message').innerHTML = 'matching';
//     //     } else {
//     //       document.getElementById('message').style.color = 'red';
//     //       document.getElementById('message').innerHTML = 'not matching';
//     //     }
//     //   }
// };