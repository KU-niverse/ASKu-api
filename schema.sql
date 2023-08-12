CREATE DATABASE
    asku_api CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE asku_api;

-- 이벤트 스케줄러 on

SET GLOBAL event_scheduler = ON;

CREATE TABLE
    `badges` (
        `id` int NOT NULL AUTO_INCREMENT,
        `name` varchar(20) NOT NULL,
        `image` text NOT NULL,
        -- badge 이미지는 로컬에 저장됨, 해당 이미지의 링크
        `description` text NOT NULL,
        `event` bool NOT NULL DEFAULT 0,
        -- [배지의 특성] 0: 일반, 1: 이벤트
        `cont` bool NOT NULL DEFAULT 0,
        -- [배지의 특성] 0: 단일, 1: 연속
        PRIMARY KEY(`id`)
    );

INSERT INTO
    `badges` (
        `name`,
        `image`,
        `description`,
        `event`,
        `cont`
    )
VALUES (
        '단군할아버지 터 잡으시고',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/1_%EB%8B%A8%EA%B5%B0%ED%95%A0%EC%95%84%EB%B2%84%EC%A7%80%20%ED%84%B0%20%EC%9E%A1%EC%9C%BC%EC%8B%9C%EA%B3%A0.png',
        '서비스 출시 한 달 내 새로운 문서 생성 후 세부 내용 입력 시 획득 가능',
        1,
        0
    ), (
        '개국공신',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/2_%EA%B0%9C%EA%B5%AD%EA%B3%B5%EC%8B%A0.png',
        '서비스 출시 한 달 내 다량의 정보(페이지당 500자 or 누적 1000자) 업데이트 시 획득 가능',
        1,
        0
    ), (
        '말하는 감자',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/3_%EC%A0%95%EB%B3%B4%20%EA%B8%B0%EB%A1%9D1.png',
        '누적 100자 달성',
        0,
        1
    ), (
        '새내기 하호',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/4_%EC%A0%95%EB%B3%B4%20%EA%B8%B0%EB%A1%9D2.png',
        '누적 1000자 달성',
        0,
        1
    ), (
        '대학원생 하호',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/5_%EC%A0%95%EB%B3%B4%20%EA%B8%B0%EB%A1%9D3.png',
        '누적 2500자 달성',
        0,
        1
    ), (
        '박사 하호',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/6_%EC%A0%95%EB%B3%B4%20%EA%B8%B0%EB%A1%9D4.png',
        '누적 5000자 달성',
        0,
        1
    ), (
        '교수 하호',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/7_%EC%A0%95%EB%B3%B4%20%EA%B8%B0%EB%A1%9D5.png',
        '누적 10000자 달성',
        0,
        1
    ), (
        '오류 발견!',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/8_%EB%AC%B8%EC%84%9C%20%EC%88%98%EC%A0%951.png',
        '문서 1회 이상 수정',
        0,
        1
    ), (
        '내 위키 속의 지우개',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/9_%EB%AC%B8%EC%84%9C%20%EC%88%98%EC%A0%952.png',
        '문서 3회 이상 수정',
        0,
        1
    ), (
        '내 꿈은 editor',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/10_%EB%AC%B8%EC%84%9C%20%EC%88%98%EC%A0%953.png',
        '문서 10회 이상 수정',
        0,
        1
    ), (
        '고치는 코쿤',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/11_%EB%AC%B8%EC%84%9C%20%EC%88%98%EC%A0%954.png',
        '문서 20회 이상 수정',
        0,
        1
    ), (
        '보안관',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/12_%EC%8B%A0%EA%B3%A01.png',
        '실제 신고 5회 이상',
        0,
        1
    ), (
        '암행어사',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/13_%EC%8B%A0%EA%B3%A02.png',
        '실제 신고 10회 이상',
        0,
        1
    ), (
        '정의구현',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/14_%EC%8B%A0%EA%B3%A03.png',
        '실제 신고 15회 이상',
        0,
        1
    ), (
        '다크나이트',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/15_%EC%8B%A0%EA%B3%A04.png',
        '실제 신고 30회 이상',
        0,
        1
    ), (
        '똑똑똑… 여기가 asku인가요?',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/16_%EC%B6%9C%EC%84%9D1.png',
        '첫 가입 시 획득, 1일 출석',
        0,
        1
    ), (
        '작심삼일을 이겨내고',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/17_%EC%B6%9C%EC%84%9D2.png',
        '연속 4일 출석',
        0,
        1
    ), (
        '나는 오늘도 asku',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/18_%EC%B6%9C%EC%84%9D3.png',
        '연속 10일 출석',
        0,
        1
    ), (
        'asku와 100일♥',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/19_%EC%B6%9C%EC%84%9D4.png',
        '연속 100일 출석',
        0,
        1
    ), (
        '제 목소리가 들리시나요?',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/20_%ED%86%A0%EB%A1%A01.png',
        '첫 토론글(메시지) 작성',
        0,
        1
    ), (
        '변론가',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/21_%ED%86%A0%EB%A1%A02.png',
        '누적 토론글 10개 작성',
        0,
        1
    ), (
        '필리버스터🔥',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/22_%ED%86%A0%EB%A1%A03.png',
        '누적 토론글 30개 작성',
        0,
        1
    ), (
        '내공냠냠 신고합니다',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/23_%EC%A7%88%EB%AC%B81.png',
        '첫 질문글 작성',
        0,
        1
    ), (
        '이 시대의 질문왕!',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/24_%EC%A7%88%EB%AC%B82.png',
        '누적 질문글 10개 작성',
        0,
        1
    ), (
        '물음표 살인마',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/25_%EC%A7%88%EB%AC%B83.png',
        '누적 질문글 30개 작성',
        0,
        1
    ), (
        'asku의 답변은 문서 기여',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/26_%EB%8B%B5%EB%B3%801.png',
        '첫 댓글 작성',
        0,
        1
    ), (
        '이젠 좀 익숙해졌을지도…',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/27_%EB%8B%B5%EB%B3%802.png',
        '누적 댓글 30개 작성',
        0,
        1
    ), (
        '고인물을 향해서',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/28_%EB%8B%B5%EB%B3%803.png',
        '누적 댓글 100개 작성',
        0,
        1
    ), (
        '문서 지박령',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/29_%EB%8B%B5%EB%B3%804.png',
        '누적 댓글 200개 작성',
        0,
        1
    ), (
        'ㄹㅇㅋㅋ',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/30_%EC%B6%94%EC%B2%9C1.png',
        '추천 10개 이상',
        0,
        1
    ), (
        '당신은 추천왕!',
        'https://kr.object.ncloudstorage.com/image-bucket/badge/31_%EC%B6%94%EC%B2%9C2.png',
        '추천 50개 이상',
        0,
        1
    );

CREATE TABLE
    `users` (
        `id` int NOT NULL AUTO_INCREMENT,
        `login_id` varchar(30) NOT NULL UNIQUE,
        -- 로그인 시 사용되는 id
        `name` varchar(15) NOT NULL,
        `stu_id` char(10) NOT NULL,
        `email` varchar(255) NOT NULL UNIQUE,
        `password` varchar(255) NOT NULL,
        `nickname` varchar(20) NOT NULL UNIQUE,
        `rep_badge` int NULL,
        -- 대표 배지
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `point` int NOT NULL DEFAULT 0,
        `is_admin` bool NOT NULL DEFAULT 0,
        -- [유저 종류] 0: 일반 유저, 1: 관리자 유저
        `restrict_period` date NULL,
        -- 이용 제한 기한(date: 2023-06-25)
        `restrict_count` tinyint NOT NULL DEFAULT 0,
        -- 이용 제한 횟수
        `uuid` varchar(255) NOT NULL UNIQUE,
        -- 식별을 위한 uuid column,
        `is_deleted` bool NOT NULL DEFAULT 0,
        -- [탈퇴 여부] 0: 존재 회원 1: 탈퇴 회원
        PRIMARY KEY(`id`),
        FOREIGN KEY (`rep_badge`) REFERENCES `badges` (`id`)
    );

-- 비로그인용 유저

INSERT INTO
    `asku_api`.`users` (
        `id`,
        `login_id`,
        `name`,
        `stu_id`,
        `email`,
        `password`,
        `nickname`,
        `point`,
        `is_admin`,
        `restrict_count`,
        `uuid`,
        `is_deleted`
    )
VALUES (
        '0',
        'unsignedin',
        '비로그인',
        '0000000000',
        'unsignedin0123@korea.ac.kr',
        '1234123456',
        '비로그인',
        '0',
        '0',
        '0',
        '1234',
        '0'
    );

UPDATE `asku_api`.`users`
SET `id` = '0'
WHERE (`id` = last_insert_id());

CREATE TABLE
    `wiki_docs` (
        `id` int NOT NULL AUTO_INCREMENT,
        `title` varchar(100) NOT NULL,
        `text_pointer` text NOT NULL,
        `latest_ver` int NOT NULL,
        `type` enum('doc', 'list') NOT NULL,
        -- [문서 타입] doc: 목차형, list: 나열형
        `is_deleted` bool NOT NULL DEFAULT 0,
        -- [문서 삭제 여부] 0: 존재하는 문서 1: 삭제한 문서
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(`id`)
    );

CREATE TABLE
    `questions` (
        `id` int NOT NULL AUTO_INCREMENT,
        `doc_id` int NOT NULL,
        -- 질문이 속한 문서 id,
        `user_id` int NOT NULL,
        `index_title` text NOT NULL,
        -- [목차 제목] (1. 개요)
        `content` text NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `answer_or_not` bool NOT NULL DEFAULT 0,
        -- [답변 여부] 0: 답변 없음, 1: 답변 있음
        `is_bad` bool NOT NULL DEFAULT 0,
        -- [부적절한 질문인지 여부] 0: 적절, 1: 부적절
        PRIMARY KEY(`id`),
        FOREIGN KEY (`doc_id`) REFERENCES `wiki_docs` (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE
    `wiki_history` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        `doc_id` int NOT NULL,
        `text_pointer` text NOT NULL,
        `version` int NOT NULL,
        `summary` text NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `is_q_based` bool NOT NULL DEFAULT 0,
        -- 질문 기반 수정 여부
        `count` int NOT NULL,
        -- 글자수
        `diff` int NOT NULL,
        -- 이전 히스토리와의 변경 글자수
        `is_bad` bool NOT NULL DEFAULT 0,
        -- [부적절한 히스토리인지 여부] 0: 적절, 1: 부적절
        `is_rollback` bool NOT NULL DEFAULT 0,
        -- [롤백 히스토리인지 여부] 0: 일반, 1: 롤백
        PRIMARY KEY(`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
        FOREIGN KEY (`doc_id`) REFERENCES `wiki_docs` (`id`)
    );

CREATE TABLE
    `wiki_favorites` (
        `doc_id` int NOT NULL,
        `user_id` int NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`doc_id`, `user_id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
        FOREIGN KEY (`doc_id`) REFERENCES `wiki_docs` (`id`)
    );

CREATE TABLE
    search_history (
        `id` int AUTO_INCREMENT NOT NULL,
        `user_id` int NOT NULL,
        -- 검색한 유저(로그인)
        `keyword` varchar(255) NOT NULL,
        -- 검색어
        `search_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        -- 검색한 시간
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE
    `debates` (
        `id` int NOT NULL AUTO_INCREMENT,
        `doc_id` int NOT NULL,
        `user_id` int NOT NULL,
        `subject` varchar(20) NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `recent_edited_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        -- 가장 마지막으로 토론한 시각
        `done_or_not` bool NOT NULL DEFAULT 0,
        -- [토론 종료 여부] 0: 진행 중, 1: 종료됨
        `done_at` timestamp NULL,
        `is_bad` bool NOT NULL DEFAULT 0,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`doc_id`) REFERENCES `wiki_docs` (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE
    `badge_history` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        `badge_id` int NOT NULL,
        `is_bad` bool NOT NULL DEFAULT 0,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
        FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`)
    );

CREATE TABLE
    `ai_session` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE
    `answers` (
        `id` int NOT NULL AUTO_INCREMENT,
        `wiki_history_id` int NOT NULL,
        -- 해당 answer과 매치되는 wiki_history id
        `question_id` int NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`wiki_history_id`) REFERENCES `wiki_history` (`id`),
        FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
    );

CREATE TABLE
    `debate_history` (
        `id` int NOT NULL AUTO_INCREMENT,
        `debate_id` int NOT NULL,
        `user_id` int NOT NULL,
        `content` text NOT NULL,
        `is_bad` bool NOT NULL DEFAULT 0,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`debate_id`) REFERENCES `debates` (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE
    `ai_history` (
        `id` int NOT NULL AUTO_INCREMENT,
        `session_id` int NOT NULL,
        `q_content` text NOT NULL,
        `a_content` text NOT NULL,
        `reference` text NULL,
        -- 출처 텍스트
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `is_deleted` bool NOT NULL DEFAULT 0,
        -- [히스토리 초기화 여부] 0: 존재 1: 삭제(초기화)된 히스토리
        PRIMARY KEY (`id`),
        FOREIGN KEY (`session_id`) REFERENCES `ai_session` (`id`)
    );

CREATE TABLE
    `report_type` (
        `id` int NOT NULL AUTO_INCREMENT,
        `description` varchar(20) NOT NULL,
        PRIMARY KEY(`id`)
    );

CREATE TABLE
    `feedback` (
        `id` int NOT NULL AUTO_INCREMENT,
        `qna_id` int NOT NULL,
        `feedback` bool NOT NULL,
        -- [평가] 0: 좋아요, 1: 나빠요
        PRIMARY KEY(`id`),
        FOREIGN KEY (`qna_id`) REFERENCES `ai_history` (`id`)
    );

CREATE TABLE
    `feedback_content` (
        `id` int NOT NULL AUTO_INCREMENT,
        `feedback_id` int NOT NULL,
        `content` text NOT NULL,
        PRIMARY KEY(`id`),
        FOREIGN KEY (`feedback_id`) REFERENCES `feedback` (`id`)
    );

insert into `report_type` (description) values ('위키 히스토리');

insert into `report_type` (description) values ('질문');

insert into `report_type` (description) values ('토론방');

insert into `report_type` (description) values ('토론 메시지');

CREATE TABLE
    `report_reason` (
        `id` int NOT NULL AUTO_INCREMENT,
        `description` varchar(20) NOT NULL,
        PRIMARY KEY(`id`)
    );

insert into `report_reason` (description) values ('상업적 광고 및 판매');

insert into `report_reason` (description) values ('정치인 비하 및 선거운동');

insert into `report_reason` (description) values ('게시판 성격에 부적절함');

insert into `report_reason` (description) values ('음란물');

insert into `report_reason` (description) values ('낚시/놀람/도배');

insert into `report_reason` (description) values ('사칭/사기');

insert into `report_reason` (description) values ('욕설/비하');

insert into `report_reason` (description) values ('기타 사유');

CREATE TABLE
    `reports` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        `type_id` int NOT NULL,
        -- [신고 종류] 1: 위키 히스토리 2: 질문 3: 토론방 4: 토론 메시지
        `target` int NOT NULL,
        -- [신고 대상] 1: wiki_history(id) 2: questions(id) 3: debates(id) 4: debate_history(id)
        `reason_id` int NOT NULL,
        -- [신고 사유] 문서 훼손, 욕설 등등...
        `comment` text NULL,
        -- [신고 추가 정보] 유저가 작성한 추가 정보
        `is_checked` tinyint NOT NULL DEFAULT 0,
        -- [승인 여부] 0: 미확인 1: 승인됨 -1: 반려됨
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
        FOREIGN KEY (`type_id`) REFERENCES `report_type` (`id`),
        FOREIGN KEY (`reason_id`) REFERENCES `report_reason` (`id`)
    );

CREATE TABLE
    `question_like` (
        `id` int NOT NULL,
        `user_id` int NOT NULL,
        PRIMARY KEY (`id`, `user_id`),
        FOREIGN KEY (`id`) REFERENCES `questions` (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE
    `notification_type` (
        `id` int NOT NULL AUTO_INCREMENT,
        `description` text NOT NULL,
        `is_admin` bool NOT NULL DEFAULT 0,
        -- [관리자 알림 여부] 0: 일반 알림 1: 관리자 알림 
        PRIMARY KEY (`id`)
    );

INSERT INTO
    `notification_type` (`description`, `is_admin`)
VALUES ('즐겨찾기한 문서 질문', 0), ('좋아요한 질문 답변', 0), ('자기가 한 질문에 답변 등록됨', 0), ('새로운 배지 부여', 0), ('특정 토큰 이상의 데이터 수정', 1), ('새로운 문서 생성됨', 1), ('새로운 신고 생성됨', 1), ('비정상/반복적 글 수정', 1);

CREATE TABLE
    `user_attend` (
        `user_id` int NOT NULL,
        `today_attend` bool NOT NULL DEFAULT 0,
        -- [일일 출석 여부] 0: 오늘  출석 안 함 1: 오늘 출석함
        `cont_attend` int NOT NULL DEFAULT 0,
        -- [연속 출석 일수]
        `total_attend` int NOT NULL DEFAULT 0,
        -- [총 출석 일수]
        `max_attend` int NOT NULL DEFAULT 0,
        -- [최대 연속 출석 일수]
        PRIMARY KEY (`user_id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

CREATE TABLE
    `notifications` (
        `id` int NOT NULL AUTO_INCREMENT,
        `user_id` int NOT NULL,
        `type_id` int NOT NULL,
        `read_or_not` bool NOT NULL DEFAULT 0,
        -- [읽음 여부]
        `message` varchar(255) NOT NULL,
        -- [메시지 내용]
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
        FOREIGN KEY (`type_id`) REFERENCES `notification_type` (`id`)
    );

CREATE TABLE
    `user_action` (
        `user_id` int NOT NULL,
        `record_count` int NOT NULL DEFAULT 0,
        -- [일반 기록 글자수]
        `revise_count` int NOT NULL DEFAULT 0,
        -- [일반 수정 횟수]
        `report_count` int NOT NULL DEFAULT 0,
        -- [일반 신고 횟수]
        `debate_count` int NOT NULL DEFAULT 0,
        -- [일반 토론 작성 개수]
        `question_count` int NOT NULL DEFAULT 0,
        -- [일반 질문 개수]
        `like_count` int NOT NULL DEFAULT 0,
        -- [일반 추천 개수]
        `answer_count` int NOT NULL DEFAULT 0,
        -- [일반 답변 개수]
        `event_begin` bool NOT NULL DEFAULT 0,
        -- [이벤트 초기 이벤트: 용도 미정]
        PRIMARY KEY (`user_id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

-- 뱃지 목록과 트리거 정의

-- 1. (오픈 이벤트) 단군할아버지 터 잡으시고

DELIMITER //

CREATE TRIGGER CHECK_EVENT_BEGINNING_UPDATE AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 1
	    AND is_bad = 0;
	IF NEW.record_count > 0
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 1);
	END IF;
	END;


//

DELIMITER ;

-- 2. (오픈 이벤트) 개국공신

DELIMITER //

CREATE TRIGGER CHECK_EVENT_OPENING_UPDATE AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 2
	    AND is_bad = 0;
	IF NEW.record_count > 0
	AND badge_exists = 0 THEN -- 결정 후 수정 필요
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 2);
	END IF;
	END;


//

DELIMITER ;

-- 3. (정보 기록) 말하는 감자

DELIMITER //

CREATE TRIGGER CHECK_RECORD_UPDATE_01 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 3
	    AND is_bad = 0;
	IF NEW.record_count > 100
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 3);
	END IF;
	END;


//

DELIMITER ;

-- 4. (정보 기록) 새내기 하호

DELIMITER //

CREATE TRIGGER CHECK_RECORD_UPDATE_02 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 4
	    AND is_bad = 0;
	IF NEW.record_count > 1000
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 4);
	END IF;
	END;


//

DELIMITER ;

-- 5. (정보 기록) 대학원생 하호

DELIMITER //

CREATE TRIGGER CHECK_RECORD_UPDATE_03 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 5
	    AND is_bad = 0;
	IF NEW.record_count > 2500
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 5);
	END IF;
	END;


//

DELIMITER ;

-- 6. (정보 기록) 박사 하호

DELIMITER //

CREATE TRIGGER CHECK_RECORD_UPDATE_04 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 6
	    AND is_bad = 0;
	IF NEW.record_count > 5000
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 6);
	END IF;
	END;


//

DELIMITER ;

-- 7. (정보 기록) 교수 하호

DELIMITER //

CREATE TRIGGER CHECK_RECORD_UPDATE_05 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 7
	    AND is_bad = 0;
	IF NEW.record_count > 10000
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 7);
	END IF;
	END;


//

DELIMITER ;

-- 8. (문서 수정) 오류 발견!

DELIMITER //

CREATE TRIGGER CHECK_REVISE_UPDATE_01 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 8
	    AND is_bad = 0;
	IF NEW.revise_count >= 1
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 8);
	END IF;
	END;


//

DELIMITER ;

-- 9. (문서 수정) 내 위키 속의 지우개

DELIMITER //

CREATE TRIGGER CHECK_REVISE_UPDATE_02 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 9
	    AND is_bad = 0;
	IF NEW.revise_count >= 3
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 9);
	END IF;
	END;


//

DELIMITER ;

-- 10. (문서 수정) 내 꿈은 editor

DELIMITER //

CREATE TRIGGER CHECK_REVISE_UPDATE_03 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 10
	    AND is_bad = 0;
	IF NEW.revise_count >= 10
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 10);
	END IF;
	END;


//

DELIMITER ;

-- 11. (문서 수정) 고치는 코쿤

DELIMITER //

CREATE TRIGGER CHECK_REVISE_UPDATE_04 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 11
	    AND is_bad = 0;
	IF NEW.revise_count >= 20
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 11);
	END IF;
	END;


//

DELIMITER ;

-- 12. (신고) 보안관

DELIMITER //

CREATE TRIGGER CHECK_REPORT_UPDATE_01 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 12
	    AND is_bad = 0;
	IF NEW.report_count >= 5
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 12);
	END IF;
	END;


//

DELIMITER ;

-- 13. (신고) 암행어사

DELIMITER //

CREATE TRIGGER CHECK_REPORT_UPDATE_02 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 13
	    AND is_bad = 0;
	IF NEW.report_count >= 10
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 13);
	END IF;
	END;


//

DELIMITER ;

-- 14. (신고) 정의구현

DELIMITER //

CREATE TRIGGER CHECK_REPORT_UPDATE_03 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 14
	    AND is_bad = 0;
	IF NEW.report_count >= 15
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 14);
	END IF;
	END;


//

DELIMITER ;

-- 15. (신고) 다크나이트

DELIMITER //

CREATE TRIGGER CHECK_REPORT_UPDATE_04 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 15
	    AND is_bad = 0;
	IF NEW.report_count >= 30
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 15);
	END IF;
	END;


//

DELIMITER ;

-- 16. (출석) 똑똑똑… 여기가 asku인가요?

DELIMITER //

CREATE TRIGGER CHECK_ATTEND_UPDATE_01 AFTER UPDATE 
ON USER_ATTEND FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 16
	    AND is_bad = 0;
	IF NEW.cont_attend >= 1
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 16);
	END IF;
	END;


//

DELIMITER ;

-- 17. (출석) 작심삼일을 이겨내고

DELIMITER //

CREATE TRIGGER CHECK_ATTEND_UPDATE_02 AFTER UPDATE 
ON USER_ATTEND FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 17
	    AND is_bad = 0;
	IF NEW.cont_attend >= 4
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 17);
	END IF;
	END;


//

DELIMITER ;

-- 18. (출석) 나는 오늘도 asku

DELIMITER //

CREATE TRIGGER CHECK_ATTEND_UPDATE_03 AFTER UPDATE 
ON USER_ATTEND FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 18
	    AND is_bad = 0;
	IF NEW.cont_attend >= 10
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 18);
	END IF;
	END;


//

DELIMITER ;

-- 19. (출석) asku와 100일♥

DELIMITER //

CREATE TRIGGER CHECK_ATTEND_UPDATE_04 AFTER UPDATE 
ON USER_ATTEND FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 19
	    AND is_bad = 0;
	IF NEW.cont_attend >= 100
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 19);
	END IF;
	END;


//

DELIMITER ;

-- 20. (토론) 제 목소리가 들리시나요?

DELIMITER //

CREATE TRIGGER CHECK_DEBATE_UPDATE_01 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 20
	    AND is_bad = 0;
	IF NEW.debate_count = 1
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 20);
	END IF;
	END;


//

DELIMITER ;

-- 21. (토론) 변론가

DELIMITER //

CREATE TRIGGER CHECK_DEBATE_UPDATE_02 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 21
	    AND is_bad = 0;
	IF NEW.debate_count = 10
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 21);
	END IF;
	END;


//

DELIMITER ;

-- 22. (토론) 필리버스터🔥

DELIMITER //

CREATE TRIGGER CHECK_DEBATE_UPDATE_03 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 22
	    AND is_bad = 0;
	IF NEW.debate_count = 30
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 22);
	END IF;
	END;


//

DELIMITER ;

-- 23. (질문) 내공냠냠 신고합니다

DELIMITER //

CREATE TRIGGER CHECK_QUESTION_UPDATE_01 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 23
	    AND is_bad = 0;
	IF NEW.question_count >= 1
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 23);
	END IF;
	END;


//

DELIMITER ;

-- 24. (질문) 이 시대의 질문왕!

DELIMITER //

CREATE TRIGGER CHECK_QUESTION_UPDATE_02 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 24
	    AND is_bad = 0;
	IF NEW.question_count >= 10
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 24);
	END IF;
	END;


//

DELIMITER ;

-- 25. (질문) 물음표 살인마

DELIMITER //

CREATE TRIGGER CHECK_QUESTION_UPDATE_03 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 25
	    AND is_bad = 0;
	IF NEW.question_count >= 30
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 25);
	END IF;
	END;


//

DELIMITER ;

-- 26. (답변) asku의 답변은 문서 기여

DELIMITER //

CREATE TRIGGER CHECK_ANSWER_UPDATE_01 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 26
	    AND is_bad = 0;
	IF NEW.answer_count >= 1
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 26);
	END IF;
	END;


//

DELIMITER ;

-- 27. (답변) 이젠 좀 익숙해졌을지도...

DELIMITER //

CREATE TRIGGER CHECK_ANSWER_UPDATE_02 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 27
	    AND is_bad = 0;
	IF NEW.answer_count >= 30
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 27);
	END IF;
	END;


//

DELIMITER ;

-- 28. (답변) 고인물을 향해서

DELIMITER //

CREATE TRIGGER CHECK_ANSWER_UPDATE_03 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 28
	    AND is_bad = 0;
	IF NEW.answer_count >= 100
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 28);
	END IF;
	END;


//

DELIMITER ;

-- 29. (답변) 문서 지박령

DELIMITER //

CREATE TRIGGER CHECK_ANSWER_UPDATE_04 AFTER UPDATE 
ON USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 29
	    AND is_bad = 0;
	IF NEW.answer_count >= 200
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 29);
	END IF;
	END;


//

DELIMITER ;

-- 30. (추천) ㄹㅇㅋㅋ

DELIMITER //

CREATE TRIGGER CHECK_LIKE_UPDATE_01 AFTER UPDATE ON 
USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 30
	    AND is_bad = 0;
	IF NEW.like_count >= 10
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 30);
	END IF;
	END;


//

DELIMITER ;

-- 31. (추천) 당신은 추천왕!

DELIMITER //

CREATE TRIGGER CHECK_LIKE_UPDATE_02 AFTER UPDATE ON 
USER_ACTION FOR EACH ROW BEGIN DECLARE 
	DECLARE DECLARE DECLARE DECLARE DECLARE badge_exists INT;
	SELECT
	    COUNT(*) INTO badge_exists
	FROM badge_history
	WHERE
	    user_id = NEW.user_id
	    AND badge_id = 31
	    AND is_bad = 0;
	IF NEW.like_count >= 50
	AND badge_exists = 0 THEN
	INSERT INTO
	    badge_history(user_id, badge_id)
	VALUES (NEW.user_id, 31);
	END IF;
	END;


//

DELIMITER ;

CREATE TABLE
    `temp_users` (
        `login_id` varchar(30) NOT NULL UNIQUE,
        -- 로그인 시 사용되는 id
        `name` varchar(15) NOT NULL,
        `stu_id` char(10) NOT NULL,
        `email` varchar(255) NOT NULL UNIQUE,
        `password` varchar(255) NOT NULL,
        `nickname` varchar(20) NOT NULL UNIQUE,
        `uuid` varchar(255) NOT NULL,
        `auth_uuid` varchar(255) NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(`email`)
    );

-- 매일 오전 4시에 생성된 행 중 2시간 이상 된 행을 삭제

DROP EVENT IF EXISTS reset_temp_users;

CREATE EVENT RESET_TEMP_USERS 
	RESET_TEMP_USERS RESET_TEMP_USERS RESET_TEMP_USERS RESET_TEMP_USERS reset_temp_users ON SCHEDULE EVERY 1 DAY STARTS '2023-07-02 04:00:00'
	DO
	DELETE FROM temp_users
	WHERE
	    created_at <= DATE_SUB(NOW(), INTERVAL 2 HOUR);


CREATE TABLE
    `change_pw_session` (
        `user_id` int NOT NULL,
        `change_pw_token` varchar(255) NOT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`user_id`, `change_pw_token`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    );

-- 매일 오전 4시에 생성된 행 중 2시간 이상 된 행을 삭제

DROP EVENT IF EXISTS reset_change_pw_session;

CREATE EVENT RESET_CHANGE_PW_SESSION 
	RESET_CHANGE_PW_SESSION RESET_CHANGE_PW_SESSION RESET_CHANGE_PW_SESSION RESET_CHANGE_PW_SESSION reset_change_pw_session ON SCHEDULE EVERY 1 DAY STARTS '2023-07-02 04:00:00'
	DO
	DELETE FROM
	    change_pw_session
	WHERE
	    created_at <= DATE_SUB(NOW(), INTERVAL 2 HOUR);


-- 매일 오전 0시에 출석여부를 확인하여 연속 출석을 0으로 만들고, 모든 사용자의 오늘 출석을 false로 재설정

CREATE EVENT RESET_CONTINUOUS_ATTENDANCE_FOR_ABSENT_USERS 
	RESET_CONTINUOUS_ATTENDANCE_FOR_ABSENT_USERS RESET_CONTINUOUS_ATTENDANCE_FOR_ABSENT_USERS RESET_CONTINUOUS_ATTENDANCE_FOR_ABSENT_USERS RESET_CONTINUOUS_ATTENDANCE_FOR_ABSENT_USERS reset_continuous_attendance_for_absent_users ON SCHEDULE EVERY 1 DAY STARTS '2023-07-24 00:00:00'
	DO
	UPDATE `user_attend`
	SET `cont_attend` = 0
	WHERE `today_attend` = 0;


CREATE EVENT RESET_TODAY_ATTENDANCE_FOR_ALL_USERS 
	RESET_TODAY_ATTENDANCE_FOR_ALL_USERS RESET_TODAY_ATTENDANCE_FOR_ALL_USERS RESET_TODAY_ATTENDANCE_FOR_ALL_USERS RESET_TODAY_ATTENDANCE_FOR_ALL_USERS reset_today_attendance_for_all_users ON SCHEDULE EVERY 1 DAY STARTS '2023-07-24 00:00:10' -- 10초 뒤에 실행
	DO
	UPDATE `user_attend`
	SET `today_attend` = 0;
