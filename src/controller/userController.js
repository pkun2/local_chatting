import { auth, rtDB } from "../firebase.js";

export const getLogin = (req, res) => {
    // 데이터 쓰기 예제
    const user = req.session.user;
    if(user != undefined) {
        console.log("세션 생성됨", );
        console.log(user);
    }
    else {
        console.log("세션 생성안됨");
        console.log(user);
    }

    return res.render("login");
}
export const postLogin = async(req, res) => {
    async function loginController(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            req.session.user = {
                uid: user.uid,
                email: user.email,
            };

            console.log("로그인 성공", user.uid)
            return res.redirect("/");
        } catch (error) {
            res.render("login", { error: error.message });
        }
    }
    const { email, password } = req.body;
    loginController(email, password);
    //post method 처리
}
export const getRegister = (req, res) => {
    return res.render("register");
}
export const postRegister = (req, res) => {
    async function signUpController(email, password) {
        try {
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          
          // 회원가입 성공
          const user = userCredential.user;
          
          console.log('Success creating user:', user.uid);

          return res.redirect("/user/login");
        } catch (error) {
          // 회원가입 실패
          return res.render("register", {error: error.message});
        }
    }
    const {email, password, confirmPassword} = req.body;
    
    if (password !== confirmPassword) {
        res.render("register", {error: "비밀번호와 비밀번호확인 일치하지 않음"});
    }
    else {
        signUpController(email, password);
    }
    //post method 처리
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};