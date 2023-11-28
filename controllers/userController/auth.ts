import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import User from "../../models/userModel";
import Action from "../../models/actionModel";
import { v4 as uuidv4 } from "uuid";
import * as passport from "passport";
import moment from "moment";
import * as nodemailer from "nodemailer";


exports.idDupCheck = async (req: Request, res: Response) => {
  const login_id = req.params.loginid;
  try {
    const [ex_user_login_id, ex_temp_user_login_id] = await Promise.all([
      User.findByLoginId(login_id),
      User.findByLoginIdTemp(login_id),
    ]);

    if (ex_user_login_id.length != 0 || ex_temp_user_login_id.length != 0) {
      return res.status(401).json({
        success: false,
        message: "이미 존재하는 아이디입니다.",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "사용 가능한 아이디입니다.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.nickDupCheck = async (req:Request, res: Response) => {
  const nickname = req.params.nick;
  try {
    const [ex_user_nickname, ex_temp_user_nickname] = await Promise.all([
      User.findByNickname(nickname),
      User.findByNicknameTemp(nickname),
    ]);
    if (ex_user_nickname.length != 0 || ex_temp_user_nickname != 0) {
      return res.status(401).json({
        success: false,
        message: "이미 존재하는 닉네임입니다.",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "사용 가능한 닉네임입니다.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.emailDupCheck = async (req: Request, res:Response) => {
  const email = req.params.email;

  // '@korea.ac.kr' 형식인지 확인하기 위한 정규식
  const regex = /[@]korea[.]ac[.]kr$/;

  try {
    // '@korea.ac.kr' 형식이 아닌 경우 에러 메시지 전송
    if (!regex.test(email) || email == "@korea.ac.kr") {
      return res.status(402).json({
        success: false,
        message: "이메일은 '{email_id}@korea.ac.kr' 형식이어야 합니다.",
      });
    }
    const [ex_user_email, ex_temp_user_email] = await Promise.all([
      User.findByEmail(email),
      User.findByEmailTemp(email),
    ]);

    if (ex_user_email.length != 0 || ex_temp_user_email != 0) {
      return res.status(401).json({
        success: false,
        message: "이미 존재하는 이메일입니다.",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "사용 가능한 이메일입니다.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};
//TODO: 회원가입이 각 시도마다 12시간의 유효기간을 가지도록 수정요함
//FIXME: 회원가입시 이메일을 잘못 입력했을때 로직 추가요함
//FIXME: auth_uuid를 더짧고 효율적인 방식의 것으로 수정 요함
//FIXME: 중복된 값이 있을때 적절한 메세지 띄우도록 수정 요함
//FIXME: 트랜잭션이 보장되지 않음
//FIXME: 유저 회원가입시 user_attend 테이블에 항목 생성
//FIXME: 유저 회원가입시 ai_session 테이블에 항목 생성
//FIXME: 유저 회원가입시 생성되어야하는 데이터 다시 정리
//회원가입 후 인증 이메일 전송
exports.signUp = async (req: Request, res: Response) => {
  const { login_id, name, stu_id, email, password, nickname } = req.body;
  try {
    //아이디, 이메일, nickname 중복검사, 비밀번호 확인은 프론트에서 처리, 학번은 중복검사x
    const hash = await bcrypt.hash(password, 12);
    const uuid = uuidv4();
    const auth_uuid = uuidv4();
    try {
      await User.tempCreate({
        login_id,
        name,
        stu_id,
        email,
        password: hash,
        nickname,
        uuid,
        auth_uuid,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        maessage: "회원가입에 실패하였습니다. 중복된 항목이 있습니다.",
      });
    }

    //메일 전송
    //FIXME: 메일 전송시 전달되는 url 프론트완성 후 수정 필요
    //FIXME: 사진 파일 s3에 저장
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      to: email,
      subject: "ASKu 회원가입",
      attachments: [
        {
          filename: "email_auth_cut.png",
          path: "./email_auth_cut.png",
          cid: "unique@cid",
        },
        {
          filename: "email_auth_cut2.png",
          path: "./email_auth_cut2.png",
          cid: "unique@cid2",
        },
      ],
      html: `
<table align="center" width="100%" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center">
      <img src="cid:unique@cid" alt="Welcome Image" width="819px" height="372px">
    </td>
  </tr>
  <tr>
    <td align="center">
    <div style="
  width: 266px;
  height: 50px;
  background: #db3956;
  border-radius: 12px;
  box-shadow: 0 3px 5px 2px rgba(0,0,0,0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  margin-left: calc(max(-450px, -100vw + 350px));">
  <a href="https://asku.wiki/signup/complete/${auth_uuid}" style="color: white; text-decoration: none;">이메일 인증 완료하기</a>
</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="cid:unique@cid2" alt="Welcome Image2" width="819px" height="106px">
    </td>
  </tr>
</table>
`,
    };

    await transporter.sendMail(mailOptions);

    //회원가입로직 return
    return res.status(201).json({
      success: true,
      message: "이메일인증을 마치면 회원가입이 완료됩니다.",
      login_id: login_id,
      nickname,
      name,
      stu_id,
      email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      maessage: "서버 에러",
    });
  }
};

//로그인
exports.signIn = async (req:Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate("local", (authError: any, user: any, info: any) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        if (info.message === "비밀번호가 일치하지 않습니다.") {
          return res
            .status(401)
            .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "가입되지 않은 회원입니다." });
        }
      }

      const today = new Date();
      //탈퇴한 회원이거나 이용이 제한된 회원이라면 로그인 불가
      if (user[0].is_deleted == true) {
        return res
          .status(410)
          .json({ success: false, message: "탈퇴한 회원입니다." });
      } else if (new Date(user[0].restrict_period) > today) {
        return res
          .status(403)
          .json({ success: false, message: "이용이 제한된 회원입니다." });
      }

      return req.login(user, async (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }

        // 출석체크

        await User.markAttend(user[0].id);

        //로그인 성공
        return res
          .status(200)
          .json({ success: true, message: "로그인에 성공하였습니다!" });
      });
    })(req, res, next);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

//로그아웃
exports.signOut = (req: Request, res: Response) => {
  try {
    req.logout(() => {
      res.status(200).send({ success: true, message: "로그아웃 되었습니다." });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "서버에러",
    });
  }
};

//비밀번호를 잊어버린 상태에서 비밀번호 변경
exports.resetPw = async (req: Request, res: Response) => {
  try {
    const { hashed_login_id, new_password } = req.body;
    //해당 세션이 유효한지 체크
    const pw_change_session = await User.checkPwChangeSession(hashed_login_id);
    const EXPIRATION_TIME_HOURS = 3; // 세션 만료 시간을 변수로 지정(현재 3시간)
    const EXPIRATION_TIME_MILLISECONDS = EXPIRATION_TIME_HOURS * 60 * 60 * 1000; // 밀리초로 변환
    //해당 세션이 존재하지 않는다면
    if (pw_change_session.length === 0) {
      return res.status(404).json({
        success: false,
        message: "비밀번호 변경 세션이 존재하지 않습니다.",
      });
    } else if (
      //해당 세션이 만료되었다면
      moment(pw_change_session[0].created_at).valueOf() +
        EXPIRATION_TIME_MILLISECONDS <
      Date.now()
    ) {
      User.deletePwFindSession(hashed_login_id);
      return res.status(410).json({
        success: false,
        message: "비밀번호 변경 세션의 기한이 만료되었습니다.",
      });
    }
    //해당 세션이 유효하다면
    const hashed_pw = await bcrypt.hash(new_password, 12);
    await Promise.all([
      User.changePw(pw_change_session[0].user_id, hashed_pw),
      User.deletePwFindSession(hashed_login_id),
    ]);
    return res.status(200).json({
      success: true,
      message: "비밀번호 재설정이 완료되었습니다.",
    });
  } catch (error) {
    console.log(error);
    console.log("changePw(controller)에서 문제가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};
//로그인 되어있는 상태에서 유저 비밀번호 변경
exports.changePw = async (req: Request, res: Response) => {
  try {
    if (!req.user || !Array.isArray(req.user)){
      throw new Error;
    }
    const { password, new_password } = req.body;
    //기존 비밀번호와 일치하는지 확인
    const is_password_right = await bcrypt.compare(
      password,
      req.user[0].password
    );
    if (is_password_right === false) {
      return res.status(403).json({
        success: false,
        message: "기존 비밀번호가 일치하지 않습니다.",
      });
    }
    //새로운 비밀번호로 변경
    const hashed_pw = await bcrypt.hash(new_password, 12);
    await User.changePw(req.user[0].id, hashed_pw);

    return res.status(200).json({
      success: true,
      message: "비밀번호 변경이 완료되었습니다.",
    });
  } catch (error) {
    console.log("chagePw-controller에서 문제가 발생했습니다.");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.findId = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const found_user = await User.findByEmail(email);
    if (found_user.length == 0) {
      return res.status(401).json({
        success: false,
        message: "이메일과 일치하는 유저가 없습니다.",
      });
    }
    const login_id = found_user[0].login_id;
    return res.status(200).json({
      success: true,
      message: "아이디를 성공적으로 찾았습니다.",
      login_id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.findPw = async (req: Request, res: Response) => {
  try {
    const login_id = req.body.login_id;
    const user = await User.findByLoginId(login_id);
    if (user.length != 1) {
      return res.status(401).json({
        success: false,
        message: "존재하지 않는 유저 아이디입니다.",
      });
    }
    //아이디 암호화
    const hashed_login_id = await bcrypt.hash(login_id, 12);
    const code = await hashed_login_id.replace(/[?&#%:/@\[\]!*'().+]/g, "");
    //비밀번호 변경 세션 생성
    await User.createChangePwSession(login_id, code);

    //메일 전송
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      to: user[0].email,
      subject: "ASKu 비밀번호 재설정",
      attachments: [
        {
          filename: "pw_change_email_auth_cut.png",
          path: "./pw_change_email_auth.png",
          cid: "unique@cid",
        },
        {
          filename: "pw_change_email_auth_cut2.png",
          path: "./email_auth_cut2.png",
          cid: "unique@cid2",
        },
      ],
      html: `
<table align="center" width="100%" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center">
      <img src="cid:unique@cid" alt="Welcome Image" width="819px" height="370px">
    </td>
  </tr>
  <tr>
    <td align="center">
    <div style="
  width: 266px;
  height: 50px;
  background: #db3956;
  border-radius: 12px;
  box-shadow: 0 3px 5px 2px rgba(0,0,0,0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  margin-left: calc(max(-450px, -100vw + 350px));">
  <a href="https://asku.wiki/resetpw/${code}" style="color: white; text-decoration: none;">비밀번호 재설정하기</a>
</div>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="cid:unique@cid2" alt="Welcome Image2" width="819px" height="107px">
    </td>
  </tr>
</table>
`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(201).json({
      success: true,
      message: "비밀번호 변경 이메일을 전송하였습니다.",
    });
  } catch (error) {
    console.log(error);
    console.log("findPw-controller에서 문제가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.signUpEmailCheck = async (req: Request, res: Response) => {
  try {
    const auth_uuid = req.body.auth_uuid;
    const user_id = await User.register_auth(auth_uuid);

    if (user_id) {
      //user attend_check 데이터 생성
      await User.init(user_id);

      //user_action 데이터 생성
      await Action.initAction(user_id);

      return res.status(200).json({
        success: true,
        message: "회원가입을 성공적으로 완료하였습니다.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          "회원가입 세션이 만료되었습니다. 처음부터 다시 회원가입을 진행해주세요.",
      });
    }
  } catch (error) {
    console.log(error);
    console.log("signUpEmailCheck-controller에서 문제가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.deactivate = async (req: Request, res: Response) => {
  try {
    if (!req.user || !Array.isArray(req.user)){
      throw new Error;
    }
    const result = await User.deactivate(req.user[0].id);
    if (result) {
      //로그아웃 처리
      req.logout(() => {
        console.log("회원 탈퇴 후 로그아웃 되었습니다.");
      });
      return res.status(200).json({
        success: true,
        message: "회원탈퇴가 완료되었습니다.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "잘못된 접근입니다.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "서버 내부 오류가 발생했습니다.",
    });
  }
};
