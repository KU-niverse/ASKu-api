import { Request, Response } from 'express';
import { Question, getIdByTitle } from "../models/questionModel.js";
import { getWikiContent } from "./wikiController.js";
import diff from "diff";

// 질문 조회하기 (id)
export const questionGetMid = async (req: Request, res: Response) => {
  try {
    const question = await Question.getQuestionOne(req.params.id);
    if (!question) {
      res.status(400).send({success: false, message: "잘못된 id입니다."});
    } else {
      res.status(200).send({success: true, message: "질문을 조회하였습니다.", data: question});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};

// 질문 조회하기 (doc_id)
export const questionGetAllMid = async (req: { params: { title: string; flag: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; data?: any; }): void; new(): any; }; }; }) => {
  try {
    const doc_id = await getIdByTitle(decodeURIComponent(req.params.title));
    const questions = await Question.getQuestionsAll(doc_id, req.params.flag);
    if (!questions) {
      res
        .status(400)
        .send({ success: false, message: "잘못된 flag 값입니다." });
    } else {
      res.status(200).send({
        success: true,
        message: "질문 목록을 조회하였습니다.",
        data: questions,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};

// 질문 등록하기
export const questionPostMid = async (req: { body: { content: any; index_title: any; user_id: any; types_and_conditions: any[][]; }; params: { title: any; }; user: { id: any; }[]; data: any; message: string; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; }): void; new(): any; }; }; }, next: () => void) => {
  try {
    if (!req.body.content) {
      res.status(400).send({ success: false, message: "내용을 작성해주세요." });
    } else {
      const doc_id = await getIdByTitle(req.params.title);
      const newQuestion = new Question({
        doc_id: doc_id,
        user_id: req.user[0].id, // jwt token 적용 시 변경
        index_title: req.body.index_title,
        content: req.body.content,
      });
      req.data = await Question.createQuestion(newQuestion);
      req.message = "질문을 등록하였습니다.";
      req.body.user_id = req.user[0].id;
      req.body.types_and_conditions = [[1, doc_id]];
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};

// 질문 수정하기 [답변이 달리기 전까지만 가능]
export const questionEditMid = async (req: { params: { question: any; }; user: { id: any; }[]; body: { new_content: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; messsage?: string; message?: string; }): void; new(): any; }; }; }) => {
  try {
    const result = await Question.updateQuestion(
      req.params.question,
      req.user[0].id,
      req.body.new_content
    );
    if (!result) {
      res.status(400).send({
        success: false,
        messsage: "이미 답변이 달렸거나, 다른 회원의 질문입니다,",
      });
    } else {
      res
        .status(200)
        .send({ success: true, message: "질문을 수정하였습니다." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};

// 질문 삭제하기 [답변이 달리기 전, 좋아요 눌리기 전까지만 가능]
export const questionDeleteMid = async (req: { params: { question: any; }; user: { id: any; }[]; message: string; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; }): void; new(): any; }; }; }, next: () => void) => {
  try {
    const result = await Question.deleteQuestion(
      req.params.question,
      req.user[0].id
    );
    if (!result) {
      res.status(400).send({
        success: false,
        message: "이미 답변 및 좋아요가 달렸거나, 다른 회원의 질문입니다.",
      });
    } else {
      req.message = "질문을 삭제하였습니다.";
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};

// 질문 좋아요 누르기
export const questionLikeMid = async (req: { params: { question: any; }; user: { id: any; }[]; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; }): void; new(): any; }; }; }, next: () => void) => {
  try {
    const result = await Question.likeQuestion(
      req.params.question,
      req.user[0].id
    ); // jwt token 추가 후 수정
    if (result == 0) {
      res
        .status(400)
        .send({ success: false, message: "이미 좋아요를 눌렀습니다." });
    } else if (result == -1) {
      res.status(403).send({
        success: false,
        message: "본인의 질문에는 좋아요를 누를 수 없습니다.",
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};

// 질문 제목 기반으로 검색하기
export const questionSearchGetMid = async (req: { params: { query: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; data?: any; }): void; new(): any; }; }; }) => {
  try {
    let query = decodeURIComponent(req.params.query);
    if (query.includes("%") || query.includes("_")) {
      query = query.replace(/%/g, "\\%").replace(/_/g, "\\_");
    }
    if (!query) {
      res.status(400).send({ success: false, message: "잘못된 검색어입니다." });
    } else {
      const questions = await Question.getQuestionSearchByQuery(query);
      res.status(200).send({
        success: true,
        message: "질문을 검색하였습니다",
        data: questions,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};

// 인기 질문 조회하기
export const questionPopularGetMid = async (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; data?: any; }): void; new(): any; }; }; }) => {
  try {
    const questions = await Question.getQuestionsPopular();
    res.status(200).send({
      success: true,
      message: "인기 질문을 조회하였습니다.",
      data: questions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};

//TODO: 잘못된 parameter input에 대한 처리 필요
export const questionAnswerGetMid = async (req: { params: { question: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { success: boolean; message: string; data?: any; }): void; new(): any; }; }; }) => {
  try {
    const answers = await Question.getQuestionsAnswer(req.params.question);
    let updatedAnswers: any[];
    // 답변이 존재할 경우
    if (answers.length != 0) {
      updatedAnswers = await Promise.all(
        answers.map(async (item: { title: any; version: number; }) => {
          // 두 버전의 컨텐츠 가져오기
          const [post_version, current_version] = await Promise.all([
            getWikiContent(res, item.title, item.version - 1),
            getWikiContent(res, item.title, item.version),
          ]);

          // 두 버전의 컨텐츠 비교하기
          const diffResult = diff.diffChars(post_version, current_version);

          // added 속성이 true인 항목만 필터링하고, 문자열로 합치기
          const content = diffResult
            .filter((change: { added: any; }) => change.added)
            .map((change: { value: any; }) => change.value)
            .join("\n")
            .trimEnd()
            .replace(/\[\[File:.*?\]\]/g, "[이미지]")
            .replace(/\[\[(https?:\/\/[^\]|]+)(?:\|([^\]]+))?\]\]/g, "$1")
            .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_: any, doc: any, alias: any) => alias || doc)
            .replace(/..\/wiki\//g, "");

          // 합쳐진 문자열을 answer의 content 속성으로 추가하기
          return {
            ...item,
            content,
          };
        })
      );
    } else {
      // 답변이 존재하지 않을 경우
      updatedAnswers = [];
    }

    return res.status(200).send({
      success: true,
      message: "성공적으로 답변을 조회하였습니다.",
      data: updatedAnswers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "오류가 발생하였습니다." });
  }
};
