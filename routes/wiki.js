const express = require('express');
const wikiCont = require('../controllers/wikiController');
const wikiMid = require('../middlewares/wiki');
const imageMid = require('../middlewares/image');
const { isSignedIn } = require('../middlewares/sign_in');
const { isAdmin } = require('../middlewares/admin');

const router = express.Router();

// 새 위키 문서 생성하기 [기여도 지급]
/**
 * @swagger
 * /wiki/contents/new/{title}:
 *  post:
 *   tags: [wiki]
 *  summary: "새 위키 문서 생성하기 및 기여도 지급"
 *  description: "POST 방식으로 새 문서를 생성하고 기여도를 지급합니다."
 *  requestBody:
 *   description: "새 위키 문서 생성하기 위한 정보"
 *   required: true
 *   content:
 *    application/json:
 *     schema:
 *      type: object
 *      properties:
 *      text:
 *       type: string
 *       description: "문서 내용"
 *      type:
 *       type: string
 *       description: " 'doc' or 'list'"
 *   responses:
 *    200:
 *     description: "새 위키 문서 생성 성공"
 *     content:
 *      application/json:
 *       schema:
 *       type: object
 *       properties:
 *       status:
 *       type: integer
 *      description: "200"
 *   409:
 *    description: "이미 존재하는 문서"
 *   content:
 *   application/json:
 *   schema:
 *  type: object
 * properties:
 * status:
 * type: integer
 * description: "409"
 */
router.post('/contents/new/:title(*)', isSignedIn, wikiCont.newWikiPostMid, wikiMid.createHistoryMid, wikiMid.wikiPointMid);

// 특정 섹션의 글 불러오기 / 특정 섹션의 글 수정시 사용
router.get('/contents/:title(*)/section/:section', isSignedIn, wikiCont.contentsSectionGetMid);

// 특정 섹션의 글 수정하기
router.post('/contents/:title(*)/section/:section', isSignedIn, wikiCont.contentsSectionPostMid, wikiMid.createHistoryMid, wikiMid.wikiPointMid);

// 전체 글 불러오기 / 전체 글 수정시 사용
router.get('/contents/:title(*)', wikiCont.contentsGetMid);

// 전체 글 수정하기
router.post('/contents/:title(*)', isSignedIn, wikiCont.contentsPostMid, wikiMid.createHistoryMid, wikiMid.wikiPointMid);

// 이미지 업로드
router.post('/image', imageMid.imageUploader.single('image'), (req, res) => {
  console.log(req.file);
  res.json({ url: req.file.location });
});

// 특정 버전의 위키 raw data 불러오기
router.get('/historys/:title(*)/version/:version', wikiCont.historyRawGetMid);

// 특정 버전으로 롤백하기
router.post('/historys/:title(*)/version/:version', isSignedIn, wikiCont.historyVersionPostMid, wikiMid.createHistoryMid, (req, res) => {
  res.status(200).json({ message: '위키 롤백 성공' });
}); // 뒤에 알림 넣어야함

// 위키 히스토리 불러오기
router.get('/historys/:title(*)', wikiCont.historyGetMid);

// 두 버전 비교하기
router.get('/comparison/:title(*)/rev/:rev/oldrev/:oldrev', wikiCont.comparisonGetMid);

// 위키 문서 삭제하기
router.delete('/delete/:title(*)', isSignedIn, isAdmin, wikiCont.wikiDeleteMid);

// // 위키 제목 기반으로 문서 검색하기
// router.get('/search/:title(*)', wikiCont.searchWikiGetMid);

// // 목차 글 불러오기(질문 기반 문서 수정  위함)→ 있으면 섹션과 함께 주고 섹션 수정, 없으면 섹션 0으로 주고 전체 수정
// router.get('/contents/:title(*)/index/:index(*)', wikiCont.contentsSectionGetMidByIndex);

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