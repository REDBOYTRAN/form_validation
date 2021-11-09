//constructor

function Validator(options) {

    //hàm thực hiện validate
    function validate(inputElement, rule) {
        //value: inputElement.value
        //test func: rule.test
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);
        
        if(errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    };

    var formElement = document.querySelector(options.form);
    if(formElement) {
        options.rules.forEach(function(rule) {
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
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập tên của bạn';
        },
    }
};

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailPattern.test(value) ? undefined : 'Email không hợp lệ.';
        },
    }
};

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        },
    }
};