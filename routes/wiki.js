const express = require('express');
const wikiCont = require('../controllers/wikiController');
const wikiMid = require('../middlewares/wiki');
const imageMid = require('../middlewares/image');
// const { isSignedIn } = require('../middlewares/sign_in');

const router = express.Router();

// 위키 불러오기
router.get('/getWiki/:title(*)', wikiCont.wikiGetMid);

// 위키 올리기
router.post('/postWiki/:title(*)', wikiCont.wikiPostMid);

// 이미지 업로드
router.post('/postImage', imageMid.imageUploader.single('image'), (req, res) => {
  console.log(req.file);
  res.json({ url: req.file.location });
});

// 새 위키 문서 생성하기 [기여도 지급]
/**
 * @swagger
 * /api/wiki/contents/new/{title}:
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
router.post('/contents/new/:title(*)', wikiCont.newWikiPostMid, wikiMid.createHistoryMid);
// //이거 성공 status 코드 받았을 때 /user/point/wikiedit 요청해야함

// 전체 글 불러오기 / 전체 글 수정시 사용
router.get('/contents/:title(*)', wikiCont.contentsGetMid);

// 전체 글 수정하기
router.post('/contents/:title(*)', wikiCont.contentsPostMid, wikiMid.createHistoryMid);
// router.post('/contents', isSignedIn, wikiMid.contentsPostMid);
// //이거 성공 status 코드 받았을 때 /user/point/wikiedit 요청해야함

// // 특정 섹션의 글 불러오기 / 특정 섹션의 글 수정시 사용
// router.get('/contents/:section', isSignedIn, wikiMid.contentsSectionGetMid);

// // 특정 섹션의 글 수정하기
// router.post('/contents/:section', isSignedIn, wikiMid.contentsSectionPostMid);
// //이거 성공 status 코드 받았을 때 /user/point/wikiedit 요청해야함

// // 위키 전체 히스토리 불러오기
// router.get('/historys', wikiMid.historyGetMid);

// // 특정 버전의 위키 raw data 불러오기
// router.get('/historys/:version', wikiMid.historyVersionGetMid);

// // 특정 버전으로 롤백하기
// router.post('/historys/:version', isSignedIn, wikiMid.historyVersionPostMid);

// // 두 버전 비교하기
// router.get('/comparison/:rev/:oldrev', wikiMid.comparisonGetMid);

module.exports = router;