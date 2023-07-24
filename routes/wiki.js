const express = require('express');
const wikiCont = require('../controllers/wikiController');
const wikiMid = require('../middlewares/wiki');
const imageMid = require('../middlewares/image');
const { isSignedIn } = require('../middlewares/sign_in');
const { isAdmin } = require('../middlewares/admin');
const { newNotice } = require("../middlewares/notification");
const { newActionRevise, newActionRecord } = require('../middlewares/user_action');

const router = express.Router();

// 새 위키 문서 생성하기 [기여도 지급]
router.post('/contents/new/:title(*)', isSignedIn, wikiCont.newWikiPostMid, wikiMid.createHistoryMid, wikiMid.wikiPointMid, newActionRecord, newNotice);

// 특정 섹션의 글 불러오기 / 특정 섹션의 글 수정시 사용
router.get('/contents/:title(*)/section/:section', isSignedIn, wikiCont.contentsSectionGetMid);

// 특정 섹션의 글 수정하기 #FIXME: 미들웨어 두 번 요청하는 비효율
router.post('/contents/:title(*)/section/:section', isSignedIn, wikiCont.contentsSectionPostMid, wikiMid.createHistoryMid, wikiMid.wikiPointMid, newActionRecord, newActionRevise, newNotice);

// 같은 목차가 존재하는지 확인, ex) based_on_section: true, section: 3
router.get('/contents/question/:qid', isSignedIn, wikiCont.contentsSectionGetMidByIndex);

// 전체 글 불러오기 / 전체 글 수정시 사용
router.get('/contents/:title(*)', wikiCont.contentsGetMid);

// 전체 글 수정하기 #FIXME: 미들웨어 두 번 요청하는 비효율
router.post('/contents/:title(*)', isSignedIn, wikiCont.contentsPostMid, wikiMid.createHistoryMid, wikiMid.wikiPointMid, newActionRecord, newActionRevise, newNotice);

// 이미지 업로드
router.post('/image', imageMid.imageUploader.single('image'), (req, res) => {
  try{
    console.log(req.file);
    res.json({ success: true, url: req.file.location });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "이미지 업로드 중 오류" });
  }
});

// 특정 버전의 위키 raw data 불러오기
router.get('/historys/:title(*)/version/:version', wikiCont.historyRawGetMid);

// 특정 버전으로 롤백하기
router.post('/historys/:title(*)/version/:version', isSignedIn, wikiCont.historyVersionPostMid, wikiMid.createHistoryMid, newNotice, (req, res) => {
  res.status(200).json({ success: true, message: '위키 롤백 성공' });
}); // 뒤에 알림 넣어야함

// 위키 히스토리 불러오기
router.get('/historys/:title(*)', wikiCont.historyGetMid);

// 두 버전 비교하기
router.get('/comparison/:title(*)/rev/:rev/oldrev/:oldrev', wikiCont.comparisonGetMid);

// 위키 문서 삭제하기
router.delete('/contents/:title(*)', isSignedIn, isAdmin, wikiCont.wikiDeleteMid);

// 위키 제목 기반으로 문서 검색하기
router.get('/query/:title(*)', wikiCont.wikiSearchGetMid);

// 위키 즐겨찾기 조회
router.get('/favorite', isSignedIn, wikiCont.wikiFavoriteGetMid);

// 위키 즐겨찾기 추가
router.post('/favorite/:title(*)', isSignedIn, wikiCont.wikiFavoritePostMid);

// 위키 즐겨찾기 삭제
router.delete('/favorite/:title(*)', isSignedIn, wikiCont.wikiFavoriteDeleteMid);

// 문서 내 기여도 리스트 조회
router.get('/contributions/:title(*)', wikiCont.contributionGetMid);

// 특정 히스토리 bad로 변경
router.put('/badhis/:hisid', isAdmin, wikiCont.badHistoryPutMid);

module.exports = router;