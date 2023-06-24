CREATE TABLE `users` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   
   `stu_id`   char(10)   NOT NULL,
   `name`   varchar(15)   NOT NULL,
   `email`   varchar(255)   NOT NULL,
   `phone`   varchar(20)   NOT NULL,
   `password`   varchar(255)   NOT NULL,
   `nickname`   varchar(20)   NOT NULL,
   `rep_badge`   int   NULL,
   `created_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `point`   int   NOT NULL   DEFAULT 0,
   `is_admin`   bool   NOT NULL   DEFAULT 0,
   `restrict_period`   date   NULL,
   `restrict_count`   tinyint   NOT NULL   DEFAULT 0,
   PRIMARY KEY (`id`)
);

CREATE TABLE `wiki_docs` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `title`   varchar(100)   NOT NULL,
   `content`   text   NULL,
   `text_pointer`   text   NOT NULL,
   `type`   enum('doc', 'list', 'image')   NOT NULL,
   `is_deleted`   bool   NOT NULL   DEFAULT 0,
   PRIMARY KEY(`id`)
);

CREATE TABLE `questions` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `doc_id`   int   NOT NULL,
   `index_title`   text   NOT NULL,
   `writer_id`   int   NOT NULL,
   `content`   text   NOT NULL,
   `created_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `comment_or_not`   bool   NOT NULL DEFAULT 0,
   `is_bad`   bool   NOT NULL DEFAULT 0,
   PRIMARY KEY (`id`)
);

CREATE TABLE `badges` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `name`   varchar(20)   NOT NULL,
   `image`   text   NOT NULL,
   `desc`   text   NOT NULL,
   `event`   bool   NOT NULL   DEFAULT 0,
   `cont`   bool   NOT NULL   DEFAULT 0,
   PRIMARY KEY (`id`)
);

CREATE TABLE `wiki_history` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `doc_id`   int   NOT NULL,
   `user_id`   int   NOT NULL,
   `text_pointer`   text   NOT NULL,
   `summary`   text   NOT NULL,
   `created_at`  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `count`   int   NOT NULL,
   `diff`   int   NOT NULL,
   `is_bad`   bool   NOT NULL   DEFAULT 0,
   PRIMARY KEY (`id`, `doc_id`, `user_id`)
);

CREATE TABLE `wiki_favorites` (
   `doc_id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
   PRIMARY KEY (`doc_id`, `user_id`)
);

CREATE TABLE `debates` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `doc_id`   int   NOT NULL,
   `subject`   varchar(20)   NOT NULL,
   `host_id`   int   NOT NULL,
   `created_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `edited_at`   timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   `is_debating`   bool   NOT NULL DEFAULT 0,
   `done_at`   timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`, `doc_id`)
);

CREATE TABLE `badge_history` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
   `badge_id`   int   NOT NULL,
   `created_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`, `user_id`, `badge_id`)
);

CREATE TABLE `ai_session` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
   `file_pointer`   text   NOT NULL,
   PRIMARY KEY (`id`, `user_id`)
);

CREATE TABLE `comments` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `question_id`   int   NOT NULL,
   `doc_id`   int   NOT NULL,
   `history_id`   int   NOT NULL,
   `user_id`   int   NOT NULL,
   `created_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`, `question_id`, `doc_id`, `history_id`, `user_id`)
);

CREATE TABLE `debate_history` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `debate_id`   int   NOT NULL,
   `doc_id`   int   NOT NULL,
   `content`   text   NOT NULL,
   `writer_id`   int   NOT NULL,
   `created_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`, `debate_id`,`doc_id`)
);

CREATE TABLE `ai_history` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `session_id`   int   NOT NULL,
   `user_id`   int   NOT NULL,
   `content`   text   NOT NULL,
   `type`   bool   NOT NULL DEFAULT 0,
   `reference`   text   NULL,
   `created_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `review`   tinyint   NOT NULL   DEFAULT 0,
   PRIMARY KEY (`id`, `session_id`, `user_id`)
);
/* type: false => 질문 */
/* type: true => 답변 */
/* review: 0 -> 평가없음 , 1 -> 좋아요, -1 -> 싫어요 */
CREATE TABLE `report` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
   `type`   tinyint   NOT NULL,
   `target`   int   NOT NULL,
   `reason`   varchar(20)   NOT NULL,
   PRIMARY KEY (`id`, `user_id`)
);

CREATE TABLE `question_like` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
   PRIMARY KEY (`id`, `user_id`)
);

CREATE TABLE `notification_type` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `desc`   text   NOT NULL,
   PRIMARY KEY (`id`)
);

CREATE TABLE `user_attend` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `today_attend`   bool   NOT NULL   DEFAULT 0,
   `cont_attend`   int   NOT NULL   DEFAULT 0,
   `total_attend`   int   NOT NULL   DEFAULT 0,
   `max_attend`   int   NOT NULL   DEFAULT 0,
   PRIMARY KEY (`id`)
);

CREATE TABLE `notifications` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `receiver_id`   int   NOT NULL,
   `type_id`   int   NOT NULL,
   `read_or_not`   bool   NOT NULL DEFAULT 0,
   `message`   varchar(255)   NOT NULL,
   `created_at`   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`, `receiver_id`)
);

CREATE TABLE `user_action` (
   `id`   int   NOT NULL AUTO_INCREMENT,
   `user_id`   int   NOT NULL,
   `record_count`   int   NOT NULL   DEFAULT 0,
   `revise_count`   int   NOT NULL   DEFAULT 0,
   `report_count`   int   NOT NULL   DEFAULT 0,
   `debate_count`   int   NOT NULL   DEFAULT 0,
   `question_count`   int   NOT NULL   DEFAULT 0,
   `like_count`   int   NOT NULL   DEFAULT 0,
   `answer_count`   int   NOT NULL,
   `event_begin`   bool   NOT NULL   DEFAULT 0,
   PRIMARY KEY (`id`, `user_id`)
);

ALTER TABLE `questions` ADD CONSTRAINT `FK_wiki_docs_TO_questions_1` FOREIGN KEY (
   `doc_id`
)
REFERENCES `wiki_docs` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `wiki_history` ADD CONSTRAINT `FK_wiki_docs_TO_wiki_history_1` FOREIGN KEY (
   `doc_id`
)
REFERENCES `wiki_docs` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `wiki_history` ADD CONSTRAINT `FK_users_TO_wiki_history_1` FOREIGN KEY (
   `user_id`
)
REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `wiki_favorites` ADD CONSTRAINT `FK_wiki_docs_TO_wiki_favorites_1` FOREIGN KEY (
   `doc_id`
)
REFERENCES `wiki_docs` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `wiki_favorites` ADD CONSTRAINT `FK_users_TO_wiki_favorites_1` FOREIGN KEY (
   `user_id`
)
REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `debates` ADD CONSTRAINT `FK_wiki_docs_TO_debates_1` FOREIGN KEY (
   `doc_id`
)
REFERENCES `wiki_docs` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `badge_history` ADD CONSTRAINT `FK_users_TO_badge_history_1` FOREIGN KEY (
   `user_id`
)

ALTER TABLE `users` ADD CONSTRAINT `FK_users_TO_badges_1` FOREIGN KEY (
   `rep_badge`
)

REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `badge_history` ADD CONSTRAINT `FK_badges_TO_badge_history_1` FOREIGN KEY (
   `badge_id`
)
REFERENCES `badges` (
   `id`
);

ALTER TABLE `ai_session` ADD CONSTRAINT `FK_users_TO_ai_session_1` FOREIGN KEY (
   `user_id`
)
REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `comments` ADD CONSTRAINT `FK_questions_TO_comments_1` FOREIGN KEY (
   `question_id`
)
REFERENCES `questions` (
   `id`
);

ALTER TABLE `comments` ADD CONSTRAINT `FK_questions_TO_comments_2` FOREIGN KEY (
   `doc_id`
)
REFERENCES `questions` (
   `doc_id`
);

ALTER TABLE `comments` ADD CONSTRAINT `FK_wiki_history_TO_comments_1` FOREIGN KEY (
   `history_id`
)
REFERENCES `wiki_history` (
   `id`
);

ALTER TABLE `comments` ADD CONSTRAINT `FK_wiki_history_TO_comments_2` FOREIGN KEY (
   `user_id`
)
REFERENCES `wiki_history` (
   `user_id`
);

ALTER TABLE `debate_history` ADD CONSTRAINT `FK_debates_TO_debate_history_1` FOREIGN KEY (
   `debate_id`
)
REFERENCES `debates` (
   `id`
);

ALTER TABLE `debate_history` ADD CONSTRAINT `FK_debates_TO_debate_history_2` FOREIGN KEY (
   `doc_id`
)
REFERENCES `debates` (
   `doc_id`
);

ALTER TABLE `ai_history` ADD CONSTRAINT `FK_ai_session_TO_ai_history_1` FOREIGN KEY (
   `session_id`
)
REFERENCES `ai_session` (
   `id`
);

ALTER TABLE `ai_history` ADD CONSTRAINT `FK_ai_session_TO_ai_history_2` FOREIGN KEY (
   `user_id`
)
REFERENCES `ai_session` (
   `user_id`
);

ALTER TABLE `report` ADD CONSTRAINT `FK_users_TO_report_1` FOREIGN KEY (
   `user_id`
)
REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `question_like` ADD CONSTRAINT `FK_questions_TO_question_like_1` FOREIGN KEY (
   `id`
)
REFERENCES `questions` (
   `id`
);

ALTER TABLE `question_like` ADD CONSTRAINT `FK_questions_TO_question_like_2` FOREIGN KEY (
   `doc_id`
)
REFERENCES `questions` (
   `doc_id`
);

ALTER TABLE `question_like` ADD CONSTRAINT `FK_users_TO_question_like_1` FOREIGN KEY (
   `user_id`
)
REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `user_attend` ADD CONSTRAINT `FK_users_TO_user_attend_1` FOREIGN KEY (
   `id`
)
REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `notifications` ADD CONSTRAINT `FK_users_TO_notifications_1` FOREIGN KEY (
   `receiver_id`
)
REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `notifications` ADD CONSTRAINT `FK_notification_type_TO_notifications_1` FOREIGN KEY (
   `type_id`
)
REFERENCES `notification_type` (
   `id`
);

ALTER TABLE `user_action` ADD CONSTRAINT `FK_users_TO_user_action_1` FOREIGN KEY (
   `user_id`
)
REFERENCES `users` (
   `id`
) ON UPDATE CASCADE ON DELETE CASCADE;
//uuid 추가
alter table 'users' ADD 'uuid' varchar(255)