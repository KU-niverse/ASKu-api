CREATE TABLE `badges` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `name`   varchar(20)   NOT NULL,
   `image`   text   NOT NULL, -- badge 이미지는 로컬에 저장됨, 해당 이미지의 링크
   `description`   text   NOT NULL,
   `event`   bool   NOT NULL   DEFAULT 0, -- [배지의 특성] 0: 일반, 1: 이벤트
   `cont`   bool   NOT NULL   DEFAULT 0, -- [배지의 특성] 0: 단일, 1: 연속
    PRIMARY KEY(`id`)
);

CREATE TABLE `users` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `login_id`   varchar(30)   NOT NULL UNIQUE, -- 로그인 시 사용되는 id
   `name`   varchar(15)   NOT NULL,
   `stu_id`   char(10)   NOT NULL,
   `email`   varchar(255)   NOT NULL UNIQUE,
   `password`   varchar(255)   NOT NULL,
   `nickname`   varchar(20)   NOT NULL UNIQUE,
   `rep_badge`   int   NULL, -- 대표 배지
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
   `point`   int   NOT NULL   DEFAULT 0,
   `is_admin`   bool   NOT NULL   DEFAULT 0, -- [유저 종류] 0: 일반 유저, 1: 관리자 유저
   `restrict_period`   date   NULL, -- 이용 제한 기한(date: 2023-06-25)
   `restrict_count`   tinyint   NOT NULL   DEFAULT 0, -- 이용 제한 횟수
   `uuid`   varchar(255)   NOT NULL UNIQUE, -- 식별을 위한 uuid column,
    `is_deleted` bool NOT NULL DEFAULT 0, -- [탈퇴 여부] 0: 존재 회원 1: 탈퇴 회원
    PRIMARY KEY(`id`),
    FOREIGN KEY (`rep_badge`) REFERENCES `badges` (`id`) 
);

CREATE TABLE `wiki_docs` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `title`   varchar(100)   NOT NULL,
   `text_pointer`   text   NOT NULL,
    `latest_ver`   int   NOT NULL,
   `type`   enum('doc', 'list')   NOT NULL, -- [문서 타입] doc: 목차형, list: 나열형
   `is_deleted`   bool   NOT NULL   DEFAULT 0, -- [문서 삭제 여부] 0: 존재하는 문서 1: 삭제한 문서
    PRIMARY KEY(`id`)
);

CREATE TABLE `questions` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `doc_id`   int   NOT NULL, -- 질문이 속한 문서 id,
    `user_id` int NOT NULL,
   `index_title`   text   NOT NULL, -- [목차 제목] (1. 개요)
   `content`   text   NOT NULL,
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
   `answer_or_not`   bool   NOT NULL   DEFAULT 0, -- [답변 여부] 0: 답변 없음, 1: 답변 있음
   `is_bad`   bool   NOT NULL   DEFAULT 0, -- [부적절한 질문인지 여부] 0: 적절, 1: 부적절
    PRIMARY KEY(`id`),
    FOREIGN KEY (`doc_id`) REFERENCES `wiki_docs` (`id`), 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
);

CREATE TABLE `wiki_history` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
   `doc_id`   int   NOT NULL,
   `text_pointer`   text   NOT NULL,
    `version`   int   NOT NULL,
   `summary`   text   NOT NULL,
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
   `count`   int   NOT NULL, -- 글자수
   `diff`   int   NOT NULL, -- 이전 히스토리와의 변경 글자수
   `is_bad`   bool   NOT NULL   DEFAULT 0, -- [부적절한 히스토리인지 여부] 0: 적절, 1: 부적절
    PRIMARY KEY(`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`doc_id`) REFERENCES `wiki_docs` (`id`)
);

CREATE TABLE `wiki_favorites` (
   `doc_id`   int   NOT NULL,
   `user_id`   int   NOT NULL,
    PRIMARY KEY (`doc_id`, `user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`doc_id`) REFERENCES `wiki_docs` (`id`)
);

CREATE TABLE `debates` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `doc_id`   int   NOT NULL,
    `user_id`   int   NOT NULL,
   `subject`   varchar(20)   NOT NULL,
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
   `recent_edited_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP, -- 가장 마지막으로 토론한 시각
   `done_or_not`   bool   NOT NULL DEFAULT 0, -- [토론 종료 여부] 0: 진행 중, 1: 종료됨
   `done_at`   timestamp   NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`doc_id`) REFERENCES `wiki_docs` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `badge_history` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
   `badge_id`   int   NOT NULL,
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`)
);

CREATE TABLE `ai_session` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `answers` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `wiki_history_id`   int   NOT NULL, -- 해당 answer과 매치되는 wiki_history id
   `question_id`   int   NOT NULL,
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`wiki_history_id`) REFERENCES `wiki_history` (`id`),
    FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
);

CREATE TABLE `debate_history` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `debate_id`   int   NOT NULL,
    `user_id`   int   NOT NULL,
   `content`   text   NOT NULL,
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`debate_id`) REFERENCES `debates` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `ai_history` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `session_id`   int   NOT NULL,
   `content`   text   NOT NULL,
   `type`   bool   NOT NULL, -- [질문 답변 종류] 0: 질문, 1: 답변
   `reference`   text   NULL, -- 출처 텍스트
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
   `review`   tinyint   NOT NULL   DEFAULT 0, -- [평가] 0: 평가 없음, 1: 좋아요, -1: 싫어요,
    `is_deleted` bool NOT NULL DEFAULT 0, -- [히스토리 초기화 여부] 0: 존재 1: 삭제(초기화)된 히스토리
    PRIMARY KEY (`id`),
    FOREIGN KEY (`session_id`) REFERENCES `ai_session` (`id`)
);

CREATE TABLE `report_type` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `description`   varchar(20)   NOT NULL,
    PRIMARY KEY(`id`)
);

insert into `report_type` (description) values ('질문');
insert into `report_type` (description) values ('토론방');
insert into `report_type` (description) values ('토론 메시지');
insert into `report_type` (description) values ('토론 메시지');

CREATE TABLE `report_reason` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `description`   varchar(20)   NOT NULL,
    PRIMARY KEY(`id`)
);

insert into `report_reason` (description) values ('문서 훼손');
insert into `report_reason` (description) values ('욕설');

CREATE TABLE `report` (
   `id`   int   NOT NULL,
   `user_id`   int   NOT NULL,
   `type_id`   int   NOT NULL, -- [신고 종류] 1: 위키 히스토리 2: 질문 3: 토론방 4: 토론 메시지
   `target`   int   NOT NULL, -- [신고 대상] 1: wiki_history(id) 2: questions(id) 3: debates(id) 4: debate_history(id)
   `reason_id`   int   NOT NULL, -- [신고 사유] 문서 훼손, 욕설 등등...
   `comment`   text   NULL, -- [신고 추가 정보] 유저가 작성한 추가 정보
   `is_checked`   bool   NOT NULL   DEFAULT 0, -- [확인 여부] 0: 미확인 1: 확인됨
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`type_id`) REFERENCES `report_type` (`id`),
    FOREIGN KEY (`reason_id`) REFERENCES `report_reason` (`id`)
);

CREATE TABLE `question_like` (
   `id`   int   NOT NULL,
   `user_id`   int   NOT NULL,
    PRIMARY KEY (`id`, `user_id`),
    FOREIGN KEY (`id`) REFERENCES `questions` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `notification_type` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `description`   text   NOT NULL,
    `is_admin` bool NOT NULL DEFAULT 0, -- [관리자 알림 여부] 0: 일반 알림 1: 관리자 알림 
    PRIMARY KEY (`id`)
);

CREATE TABLE `user_attend` (
   `user_id`   int   NOT NULL,
   `today_attend`   bool   NOT NULL   DEFAULT 0, -- [일일 출석 여부] 0: 오늘  출석 안 함 1: 오늘 출석함
   `cont_attend`   int   NOT NULL   DEFAULT 0, -- [연속 출석 일수]
   `total_attend`   int   NOT NULL   DEFAULT 0, -- [총 출석 일수]
   `max_attend`   int   NOT NULL   DEFAULT 0, -- [최대 출석 일수]
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `notifications` (
   `id`   int   NOT NULL ,
   `user_id`   int   NOT NULL,
   `type_id`   int   NOT NULL,
   `read_or_not`   bool   NOT NULL   DEFAULT 0, -- [읽음 여부]
   `message`   varchar(255)   NOT NULL, -- [메시지 내용]
   `created_at`   timestamp   NOT NULL   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
   FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`type_id`) REFERENCES `notification_type` (`id`)
);

CREATE TABLE `user_action` (
   `user_id`   int   NOT NULL,
   `record_count`   int   NOT NULL   DEFAULT 0, -- [일반 기록 글자수]
   `revise_count`   int   NOT NULL   DEFAULT 0, -- [일반 수정 횟수]
   `report_count`   int   NOT NULL   DEFAULT 0, -- [일반 신고 횟수]
   `debate_count`   int   NOT NULL   DEFAULT 0, -- [일반 토론 작성 개수]
   `question_count`   int   NOT NULL   DEFAULT 0, -- [일반 질문 개수]
   `like_count`   int   NOT NULL   DEFAULT 0, -- [일반 추천 개수]
   `answer_count`   int   NOT NULL   DEFAULT 0, -- [일반 답변 개수]
   `event_begin`   bool   NOT NULL   DEFAULT 0, -- [이벤트 초기 이벤트: 용도 미정]
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);