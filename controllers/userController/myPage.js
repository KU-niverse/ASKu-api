const User = require("../../models/userModel");

exports.info = async (req, res) => {
  try {
    const user_info = await User.getUserInfo(req.user[0].id);
    return res.status(201).json({
      success: true,
      data: user_info,
      message: "유저 정보를 불러오는데 성공했습니다.",
    });
  } catch (error) {
    console.log(error);
    console.log("info-controller에서 오류가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.wikiHistory = async (req, res) => {
  try {
    const wikiHistory = await User.getWikiHistory(req.user[0].id);
    return res.status(201).json({
      success: true,
      data: wikiHistory,
      message: "위키 히스토리를 불러오는데 성공했습니다.",
    });
  } catch (error) {
    console.log(error);
    console.log("wikiHistory-controller에서 오류가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버에러",
    });
  }
};

exports.badgeHistory = async (req, res) => {
  try {
    const badgeHistory = await User.getBadgeHistory(req.user[0].id);
    return res.status(201).json({
      success: true,
      data: badgeHistory,
      message: "배지 히스토리를 불러오는데 성공했습니다.",
    });
  } catch (error) {
    console.log(error);
    console.log("badgeHistory-controller에서 오류가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.setRepBadge = async (req, res) => {
  try {
    const result = await User.setRepBadge(
      req.body.rep_badge_id,
      req.user[0].id
    );
    if (!result) {
      return res.status(500).json({
        success: false,
        message: `잘못된 접근입니다. 대표 배지 변경에 실패하였습니다.`,
      });
    } else {
      return res.status(201).json({
        success: true,
        message: `대표뱃지가 ${req.body.rep_badge_id}로 변경되었습니다.`,
      });
    }
  } catch (error) {
    console.log(error);
    console.log("setRepBadge-controller에서 오류가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.editNick = async (req, res) => {
  try {
    const { nickname } = req.body;

    //변경될 정보의 중복체크는 프론트에서 진행
    const result = await User.editNick(nickname, req.user[0].id);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: `해당 유저가 존재하지 않거나 중복된 항목이 있습니다.`,
      });
    } else {
      return res.status(201).json({
        success: true,
        message: `닉네임이 "${nickname}"으로 수정되었습니다.`,
      });
    }
  } catch (error) {
    console.log(error);
    console.log("editNick-controller에서 오류가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.debatetHistory = async (req, res) => {
  try {
    const commentHistory = await User.debatetHistory(req.user[0].id);
    return res.status(201).json({ success: true, message: commentHistory });
  } catch (error) {
    console.log(error);
    console.log("debatetHistory-controller에서 오류가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.questionHistory = async (req, res) => {
  try {
    if (req.params.arrange === "latest") {
      const questionHistory = await User.questionHistory(req.user[0].id, 0);
      return res.status(201).json({
        success: true,
        data: questionHistory,
        message: "나의 질문 리스트를 최신순으로 조회하였습니다.",
      });
    } else if (req.params.arrange === "popularity") {
      const questionHistory = await User.questionHistory(req.user[0].id, 1);
      return res.status(201).json({
        success: true,
        data: questionHistory,
        message: "나의 질문 리스트를 좋아요순으로 조회하였습니다.",
      });
    } else {
      return res.status(402).json({
        success: false,
        message:
          "잘못된 요청입니다. arrange위치에 latest 혹은 popularity가 들어가야합니다.",
      });
    }
  } catch (error) {
    console.log(error);
    console.log("questionHistory-controller에서 오류가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};

exports.getBadges = async (req, res) => {
  try {
    const badges = await User.getBadges();
    return res.status(201).json({
      success: true,
      data: badges,
      message: "모든 배지정보를 불러오는데 성공했습니다.",
    });
  } catch (error) {
    console.log(error);
    console.log("getBadges-controller에서 오류가 발생했습니다.");
    return res.status(500).json({
      success: false,
      message: "서버 에러",
    });
  }
};
