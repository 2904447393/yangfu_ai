document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const saveSettingsButton = document.getElementById('save-settings');
    const userInfo = document.getElementById('user-info');
    const userAvatarDisplay = document.getElementById('user-avatar-display');
    const userNameDisplay = document.getElementById('user-name-display');
    const registerButton = document.getElementById('register-button');
    const floatingMessage = document.getElementById('floating-message');
    const registerModal = document.getElementById('register-modal');
    const phoneStep = document.getElementById('phone-step');
    const passwordStep = document.getElementById('password-step');
    const sendCodeButton = document.getElementById('send-code-button');
    const verifyCodeButton = document.getElementById('verify-code-button');
    const submitRegisterButton = document.getElementById('submit-register-button');
    const phoneInput = document.getElementById('phone-input');
    const codeInput = document.getElementById('code-input');
    const passwordInput = document.getElementById('password-input');
    const loginRegisterButton = document.getElementById('login-register-button');
    const loginRegisterModal = document.getElementById('login-register-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchToRegister = document.getElementById('switch-to-register');
    const loginButton = document.getElementById('login-button');

    let userName = '用户';
    let userAvatar = 'default_user_avatar.png';
    let aiAvatar = 'default_ai_avatar.png';
    let colorTheme = 'blue';
    let fontFamily = 'kaiti';

    function displayMessage(sender, message, avatar) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'You' ? 'user-message' : 'ai-message');
        
        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('avatar-container');
        
        const avatarElement = document.createElement('img');
        avatarElement.src = avatar;
        avatarElement.classList.add('message-avatar');
        
        if (sender === 'You') {
            const userNameElement = document.createElement('div');
            userNameElement.classList.add('user-name');
            userNameElement.textContent = userName;
            avatarContainer.appendChild(userNameElement);
            avatarContainer.appendChild(avatarElement);
        } else {
            avatarContainer.appendChild(avatarElement);
        }
        
        const contentElement = document.createElement('div');
        contentElement.classList.add('message-content');
        contentElement.textContent = message;
        
        messageElement.appendChild(avatarContainer);
        messageElement.appendChild(contentElement);
        
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 更新 Coze API 配置
    // const COZE_API_KEY = 'pat_Up4ltLSSObNHvhmtsWV47ok5fA1v6W4t6noEFUBR6ph9jJN5vhFO8HSbKy3nVTb0';
    const COZE_API_KEY = 'pat_4Jrsiux7SqCEOScqz6HnQRcsgiWD2CXL1jRdlfsRKmRFxjoaMOlnEp1sm3xIA1Bw';
    const COZE_API_ENDPOINT = 'https://api.coze.cn/open_api/v2/chat';
    // const BOT_ID = '7414890242316419098';
    const BOT_ID = '7414890242316386330';

    // 生成唯一的用户 ID（这里使用简单的方法，实际应用中可能需要更复杂的逻辑）
    const USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

    async function getAIResponse(message) {
        try {
            const response = await fetch(COZE_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${COZE_API_KEY}`,
                    'Connection': 'keep-alive',
                    'Accept': '*/*'
                },
                body: JSON.stringify({
                    bot_id: BOT_ID,
                    user: USER_ID,
                    query: message,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Full API Response:', JSON.stringify(data, null, 2));

            if (data.messages && data.messages.length > 0) {
                const assistantMessage = data.messages.find(msg => msg.role === 'assistant' && msg.type === 'answer');
                if (assistantMessage) {
                    return assistantMessage.content;
                }
            }
            throw new Error('No valid message found in the response');
        } catch (error) {
            console.error('Error in getAIResponse:', error);
            throw error;
        }
    }

    function simulateAIResponse(message) {
        displayMessage('AI', "正在思考...", aiAvatar);
        getAIResponse(message)
            .then(response => {
                chatBox.removeChild(chatBox.lastChild);
                displayMessage('AI', response, aiAvatar);
            })
            .catch(error => {
                console.error('Error in simulateAIResponse:', error);
                chatBox.removeChild(chatBox.lastChild);
                displayMessage('AI', `抱歉，我遇到了一些问题：${error.message}`, aiAvatar);
            });
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            displayMessage('You', message, userAvatar);
            chatInput.value = '';
            simulateAIResponse(message);
        }
    }

    sendButton.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    settingsButton.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });

    window.addEventListener('click', function(event) {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    saveSettingsButton.addEventListener('click', function() {
        userName = document.getElementById('user-name').value;
        colorTheme = document.getElementById('color-theme').value;
        fontFamily = document.getElementById('font-family').value;

        // 处理头像上传
        const userAvatarInput = document.getElementById('user-avatar');
        const aiAvatarInput = document.getElementById('ai-avatar');

        if (userAvatarInput.files && userAvatarInput.files[0]) {
            userAvatar = URL.createObjectURL(userAvatarInput.files[0]);
        }

        if (aiAvatarInput.files && aiAvatarInput.files[0]) {
            aiAvatar = URL.createObjectURL(aiAvatarInput.files[0]);
        }

        // 应用新的主题和字体
        applyTheme(colorTheme);
        applyFont(fontFamily);

        settingsModal.style.display = 'none';
    });

    function applyTheme(theme) {
        // 这里可以根据选择的主题更改颜色
        // 例如：document.body.style.setProperty('--main-color', getThemeColor(theme));
    }

    function applyFont(font) {
        document.body.style.fontFamily = getFontFamily(font);
    }

    function getFontFamily(font) {
        switch(font) {
            case 'kaiti': return '"楷体", KaiTi, serif';
            case 'xingkai': return '"行楷", "楷体", KaiTi, serif';
            case 'xingshu': return '"行书", "楷体", KaiTi, serif';
            case 'songti': return '"宋体", SimSun, serif';
            default: return '"楷体", KaiTi, serif';
        }
    }

    // 确保registerButton存在
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            console.log('Register button clicked');
            if (registerModal) {
                registerModal.style.display = 'block';
                console.log('Register modal should be visible now');
            } else {
                console.error('Register modal not found');
            }
        });
    } else {
        console.error('Register button not found');
    }

    sendCodeButton.addEventListener('click', function() {
        if (validatePhoneNumber(phoneInput.value)) {
            // 模拟发送验证码
            showFloatingMessage('验证码已发送');
            // 这里可以添加倒计时逻辑
        } else {
            showFloatingMessage('请输入有效的手机号');
        }
    });

    verifyCodeButton.addEventListener('click', function() {
        if (codeInput.value.length === 6) {
            // 模拟验证码验证
            showFloatingMessage('验证码正确');
            phoneStep.style.display = 'none';
            passwordStep.style.display = 'block';
        } else {
            showFloatingMessage('请输入6位验证码');
        }
    });

    submitRegisterButton.addEventListener('click', function() {
        if (validatePassword(passwordInput.value)) {
            // 模拟注册过程
            showFloatingMessage('注册成功');
            registerModal.style.display = 'none';
            registerButton.style.display = 'none';
            displayUserInfo();
        } else {
            showFloatingMessage('密码格式不正确');
        }
    });

    function displayUserInfo() {
        userAvatarDisplay.src = userAvatar;
        userNameDisplay.textContent = userName;
        userInfo.classList.remove('hidden');
        if (registerButton) {
            registerButton.classList.add('hidden');
        }
    }

    function validatePhoneNumber(phone) {
        // 简单的手机号验证，可以根据需要修改
        return /^1\d{10}$/.test(phone);
    }

    function validatePassword(password) {
        // 密码必须包含大小写字母、数字和标点符号
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(password);
    }

    function showFloatingMessage(message) {
        const floatingMessage = document.getElementById('floating-message');
        floatingMessage.textContent = message;
        floatingMessage.classList.remove('hidden');
        floatingMessage.classList.add('show');

        setTimeout(() => {
            floatingMessage.classList.remove('show');
            setTimeout(() => {
                floatingMessage.classList.add('hidden');
            }, 300); // 等待淡出动画完成
        }, 3000); // 3秒后开始淡出
    }

    // 点击模态窗口外部关闭窗口
    window.onclick = function(event) {
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
    }

    if (loginRegisterButton) {
        loginRegisterButton.addEventListener('click', function() {
            if (loginRegisterModal) {
                loginRegisterModal.style.display = 'block';
            } else {
                console.error('Login/Register modal not found');
            }
        });
    } else {
        console.error('Login/Register button not found');
    }

    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            this.textContent = '返回登录';
            this.id = 'switch-to-login';
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.id === 'switch-to-login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            e.target.textContent = '立即注册';
            e.target.id = 'switch-to-register';
        }
    });

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const username = document.getElementById('login-username').value;
            if (username) {
                loginSuccess(username);
            } else {
                showFloatingMessage('请输入用户名');
            }
        });
    }

    function loginSuccess(username) {
        userName = username;
        userAvatarDisplay.src = userAvatar;
        userNameDisplay.textContent = userName;
        userInfo.classList.remove('hidden');
        if (loginRegisterButton) {
            loginRegisterButton.classList.add('hidden');
        }
        if (registerButton) {
            registerButton.classList.add('hidden');
        }
        loginRegisterModal.style.display = 'none';
        showFloatingMessage('登录成功');
    }

    // 初始化时检查登录状态
    checkLoginStatus();

    function checkLoginStatus() {
        userInfo.classList.add('hidden');
        if (loginRegisterButton) {
            loginRegisterButton.classList.remove('hidden');
        }
        if (registerButton) {
            registerButton.classList.remove('hidden');
        }
    }

    // 初始欢迎消息
    displayMessage('AI', '哈喽！我是江软23级学姐，很高兴能和你聊天。如果你对江西软件职业技术大学有任何问题或疑惑，我都会尽力为你解答的哦，让你更好地了解这所学校哒！', aiAvatar);
});