import {Report} from "../models/reportModel";
import {Wiki_docs, Wiki_history} from "../models/wikiModel";
import {Request, Response} from 'express';
import User from "../models/userModel";

// admin 위키 히스토리 조회
export const wikiHistory = async (req:Request, res: Response) => {
  try {
    const wiki_history = await Wiki.Wiki_history.getAllWikiHistory();
    return res
      .status(200)
      .send({
        success: true,
        data: wiki_history,
        message: "성공적으로 위키 히스토리를 불러왔습니다.",
      });
  } catch (error) {
    console.error(error);
    console.log("adminController-wikiHistory에서 에러 발생");
    return res.status(500).send({ success: false, message: "서버 에러" });
  }
};

export const newDoc = async (req:Request, res: Response) => {
  try {
    const wiki_docs = await Wiki.Wiki_docs.getAllDoc();
    return res.status(200).send({
      success: true,
      data: wiki_docs,
      messgae: "성공적으로 문서목록을 불러왔습니다.",
    });
  } catch (err) {
    console.error(err);
    console.log("adminController-newDoc에서 에러 발생");
    res.status(500).send({ success: false, message: "서버 에러" });
  }
};

export const report = async (req:Request, res: Response) => {
  try {
    const reports = await Report.getAllReport();
    console.log(typeof reports);
    return res.status(200).send({
      success: true,
      data: reports,
      message: "성공적으로 신고목록을 불러왔습니다.",
    });
  } catch (err) {
    console.error(err);
    console.log("adminContoller-report에서 에러 발생");
    res.status(500).send({
      success: false,
      message: "서버 에러",
    });
  }
};

export const setConstraint = async (req:Request, res: Response) => {
  try {
    const { target_user_id, restrict_period } = req.body;
    const user = await User.findById(target_user_id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "해당 유저를 찾을 수 없습니다.",
      });
    }

    await User.setConstraint(target_user_id, restrict_period);

    if (restrict_period === 0) {
      return res.status(200).send({
        success: true,
        message: "성공적으로 제한을 해제했습니다.",
      });
    }

    return res.status(200).send({
      success: true,
      message: `성공적으로 ${restrict_period}일 제한을 설정했습니다.`,
    });
  } catch (err) {
    console.error(err);
    console.log("adminContoller-setConstraint에서 에러 발생");

    return res.status(500).send({
      success: false,
      message: "서버 에러",
    });
  }
};

export const getConstraint = async (req:Request, res: Response) => {
  try {
    const result = await User.getConstraint();
    return res.status(200).send({
      success: true,
      data: result,
      message: "성공적으로 제한중인 유저 목록을 가져왔습니다.",
    });
  } catch (error) {
    console.error(error);
    console.log("adminContoller-getConstraint에서 에러 발생");
    res.status(500).send({
      success: false,
      message: "서버 에러",
    });
  }
};
