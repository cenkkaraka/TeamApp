--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: category_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.category_type AS ENUM (
    'E-commerce',
    'Health',
    'Product and Manufacturing',
    'Tech',
    'Social',
    'health'
);


ALTER TYPE public.category_type OWNER TO postgres;

--
-- Name: projectcategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.projectcategory AS ENUM (
    'ecommerce',
    'health',
    'education',
    'other'
);


ALTER TYPE public.projectcategory OWNER TO postgres;

--
-- Name: projectstage; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.projectstage AS ENUM (
    'idea',
    'prototype',
    'launched'
);


ALTER TYPE public.projectstage OWNER TO postgres;

--
-- Name: stage_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.stage_enum AS ENUM (
    'idea',
    'prototype',
    'launched'
);


ALTER TYPE public.stage_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    project_id integer NOT NULL,
    role_id integer NOT NULL,
    status character varying
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.applications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ignored_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ignored_projects (
    id integer NOT NULL,
    user_id integer NOT NULL,
    project_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ignored_projects OWNER TO postgres;

--
-- Name: ignored_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ignored_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ignored_projects_id_seq OWNER TO postgres;

--
-- Name: ignored_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ignored_projects_id_seq OWNED BY public.ignored_projects.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    content text NOT NULL,
    sent_at timestamp with time zone,
    is_read boolean DEFAULT false NOT NULL,
    project_id integer
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: project_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_roles (
    id integer NOT NULL,
    project_id integer NOT NULL,
    name character varying NOT NULL,
    skills character varying
);


ALTER TABLE public.project_roles OWNER TO postgres;

--
-- Name: project_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.project_roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.project_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    stage public.stage_enum,
    category public.category_type,
    date_posted timestamp with time zone,
    owner_id integer
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.projects ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: saved_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.saved_projects (
    id integer NOT NULL,
    user_id integer NOT NULL,
    project_id integer NOT NULL
);


ALTER TABLE public.saved_projects OWNER TO postgres;

--
-- Name: saved_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.saved_projects ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.saved_projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    hashed_password character varying NOT NULL,
    name character varying,
    phone character varying,
    role character varying,
    school character varying,
    cv_url character varying,
    portfolio_url character varying,
    bio character varying,
    skills character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: ignored_projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ignored_projects ALTER COLUMN id SET DEFAULT nextval('public.ignored_projects_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, user_id, project_id, role_id, status) FROM stdin;
8	1	8	5	pending
5	8	7	4	matched
9	1	7	4	matched
10	7	4	1	matched
1	9	4	1	matched
7	1	4	1	matched
3	9	4	1	matched
6	8	4	1	matched
11	8	9	6	pending
12	1	9	6	matched
17	10	8	5	matched
14	11	8	5	matched
4	8	8	5	matched
15	11	7	4	matched
16	10	4	1	matched
18	15	9	6	matched
13	11	9	6	matched
20	17	10	7	pending
21	17	4	1	pending
19	17	9	6	matched
\.


--
-- Data for Name: ignored_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ignored_projects (id, user_id, project_id, created_at) FROM stdin;
1	9	8	2025-06-21 13:33:52.898799
2	15	4	2025-06-23 23:47:53.160889
3	17	7	2025-06-24 00:00:46.521855
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, receiver_id, content, sent_at, is_read, project_id) FROM stdin;
1	7	1	selam	2025-06-23 20:21:29.182461+03	f	4
2	7	1	selam	2025-06-23 20:23:46.535188+03	f	4
3	8	1	selam	2025-06-23 21:23:47.670307+03	f	7
4	8	1	selam	2025-06-23 22:08:37.03653+03	f	7
5	1	8	merhaba Kaan iyi günler 	2025-06-23 22:09:42.346125+03	f	7
6	10	1	Merhaba Cenk ekibe hos geldin!!!!!	2025-06-23 22:31:04.592609+03	f	9
7	1	10	Merhaba Oguzhan Bey Hoş buldum :))	2025-06-23 22:32:05.736528+03	f	9
8	1	7	selam türkanım iyi ki varsın	2025-06-23 22:45:48.338603+03	f	4
9	10	1	çok memnun oldum	2025-06-23 23:52:30.756344+03	f	9
10	10	1	merhabaaa	2025-06-24 00:03:50.535625+03	f	9
\.


--
-- Data for Name: project_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_roles (id, project_id, name, skills) FROM stdin;
1	4	Volunteer	volunteering,Relationship,Communication
4	7	Backend Developer	python,react,design,c,postresql
5	8	Backend Developer	python,c,react,postresql,javascript
6	9	Backend Developer	python,c,react native,flutter,fastapi,postresql
7	10	volunteer	
8	11	Backend Developer	Python,c,leadership
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, title, description, stage, category, date_posted, owner_id) FROM stdin;
4	Agt	Sosyoekonomik ve sosyokültürel açıdan dezavantajlı çocuklara her hafta hem eğitim hem de eğlenceli atölyeler düzenleyeceğimiz bir proje	launched	health	2025-06-19 19:11:30.757195+03	7
7	TeamApp	takım arkadaşı bulabileceğiniz ve proje oluşturabileceğiniz bir platform	prototype	health	2025-06-19 20:18:59.983241+03	9
8	Startupio	Mobil uygulama geliştirme	prototype	health	2025-06-21 13:27:26.868526+03	9
9	Startech	Geleceğin teknolojisini beraber tasarlamak için takım arkadaşları arıyoruz.	idea	health	2025-06-23 22:06:44.507063+03	10
10	Yeşilay	İnsanlara yardım etmek için gönüllü arıyoruz	launched	health	2025-06-23 23:50:08.848585+03	15
11	aaa	fluter bilen biryazılımcı aranıyor	prototype	health	2025-06-24 00:02:11.225305+03	17
\.


--
-- Data for Name: saved_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.saved_projects (id, user_id, project_id) FROM stdin;
1	9	4
2	9	7
3	9	7
4	9	7
5	9	4
6	8	4
7	8	7
8	1	7
9	8	9
10	15	9
11	17	9
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, hashed_password, name, phone, role, school, cv_url, portfolio_url, bio, skills) FROM stdin;
2	ahmet@gmail.com	$2b$12$p2fT3y5twS6XqCihbZZojuczieGBzoC1ZMbYnJTNyDpM3GufABR4G	ahmet	\N	\N	\N	\N	\N	\N	
3	aaaa@gmail.com	$2b$12$EaYdURJyrWrG4b7MMsvo9..bmEp7.Sf2Jlg8fLOTqhgECBwL5orhG	aaaa	\N	\N	\N	\N	\N	\N	
4	bbbb@gmail.com	$2b$12$ZQn4RSdYpV9286OsicJwvur/spjo5xXGUNg3BlLsE1uu3Mx/EsEiG	bbbb	\N	\N	\N	\N	\N	\N	
5	cccc@gmail.com	$2b$12$IZwPozU6TaRwW9jPNqbCRO9CO49SjqjvO6rwIROVlV/I/j3ZUZDPC	cccc	\N	\N	\N	\N	\N	\N	
6	ddd@gmail.com	$2b$12$yQ1VlJ2LTF/1Lj8HSm59J.sdxplNCHzudx9onH2vSYjhy1iYBsfYK	ddd	\N	\N	\N	\N	\N	\N	
1	cenkkarakas2002@gmail.com	$2b$12$uu1dwVuQKChwTy8sbb3BCONneBRgb6UAhKx5S9SX8uXdJBawbOdUC	Cenk 	5362448500	Backend developer	Anku	uploads/cv/1_cv_Cenk_cv.pdf	aaa	I like books	python,c,canva
8	kaan@gmail.com	$2b$12$6.wr1N6O7YRudmnDaUjGJudCJL0KW7SI5rbyLrF/QyHZyElvM1kqO	Kaan	3333333333	Backend Developer	Hacettepe		aaaa	I like Ai	python,react,design,c,postresql
7	turkan@gmail.com	$2b$12$bmjSmLud6HW4h/SCcWMe8Oat0TfdqMMpjfcssQrjqTFLV3iDOhOVm	Türkan	7777777777	Graphic Designer 	Metu	uploads/cv/7_cv_Turkan_CV.pdf		Life is hard lately	Figma,Canva,Problem solving,Python
9	bilge@gmail.com	$2b$12$1QZlqU1yMycofxwUMgxhE.5wKX3lhAj1MOiZq0m6k4QmDdqLF8OXu	Bilge	111111111111	Volunteer	Metu			I love AGT	volunteering,Communication,Relationship
10	oguzhan@gmail.com	$2b$12$dwO5k75lNzHx/UwTSP36murdTpS9OYLmsMMLgYG65AKyiz9Xe6r1C	Oguzhan	11111111111	Project Manager	Metu			\nHigh skilled about bringing people together and organizing\n	leadership,communication,problem-solving
11	utku@gmail.com	$2b$12$ItC4fNhs7HiXu2BLrsv49u4WPOzlC06HYLJwnVFAIeSNoDD.C4GBC	Utku	2222222222222222	Backend Developer	Hacettepe			I'm interested about Ai and databases	python,c,react native,flutter,postresql,design
12	murat@gamil.com	$2b$12$g8.myje5GieUJ8NZc186Ten25y.CivucUy9dTUEec38gQPlwXHk7a	murat	\N	\N	\N	\N	\N	\N	\N
13	fatih@gmail.com	$2b$12$wlsyQlGmQeR/3qaRfJO1LevTdwgS3U63bPBPA7OH27Lvs546u0/P6	fatih	\N	\N	\N	\N	\N	\N	\N
14	kemal@gmail.com	$2b$12$mlX2RsL6kENjQi8XZpV80uXA8vP8s9CrogUi9FYeA0/lDJWFtpCfK	kemal	\N	\N	\N	\N	\N	\N	\N
15	kerem@gmail.com	$2b$12$8zRvPU.WB4.oNTANCO4eW.F5dnAjj9Y3aJZBLKl0bNh28VENqhCFm	kerem	526 244 85 00	Backend Developer	Ankü	uploads/cv/15_cv_Cenk_cv.pdf		I like Ai 	python,c,react native,postresql
16	talha@gmail.com	$2b$12$PgQrGZvc8pE6xDT5ymNtdef/2sE2HSoqDXXCkhWNtv26G2z/mqyX6	talha	\N	\N	\N	\N	\N	\N	\N
17	emre@gmail.com	$2b$12$tAJn7LvatMtueDb0AkggputejK/Zb2/8Joy.TyUKpV1SKtA6yyF8C	emre	1111111111	Backend Developer	Metu	uploads/cv/17_cv_Cenk_cv.pdf		I like Ai	react native,python,c
\.


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_id_seq', 21, true);


--
-- Name: ignored_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ignored_projects_id_seq', 3, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 10, true);


--
-- Name: project_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_roles_id_seq', 8, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 11, true);


--
-- Name: saved_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.saved_projects_id_seq', 11, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 17, true);


--
-- Name: ignored_projects _user_project_uc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ignored_projects
    ADD CONSTRAINT _user_project_uc UNIQUE (user_id, project_id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: projects id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- Name: ignored_projects ignored_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ignored_projects
    ADD CONSTRAINT ignored_projects_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: project_roles project_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_roles
    ADD CONSTRAINT project_roles_pkey PRIMARY KEY (id);


--
-- Name: saved_projects saved_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_projects
    ADD CONSTRAINT saved_projects_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_phone ON public.users USING btree (phone);


--
-- Name: applications app_project_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT app_project_id FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: applications app_role_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT app_role_id FOREIGN KEY (role_id) REFERENCES public.project_roles(id);


--
-- Name: applications app_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT app_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: ignored_projects ignored_projects_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ignored_projects
    ADD CONSTRAINT ignored_projects_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: ignored_projects ignored_projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ignored_projects
    ADD CONSTRAINT ignored_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: projects owner_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT owner_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: messages pro_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT pro_id FOREIGN KEY (project_id) REFERENCES public.projects(id) NOT VALID;


--
-- Name: project_roles project_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_roles
    ADD CONSTRAINT project_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: saved_projects project_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_projects
    ADD CONSTRAINT project_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: messages receiver_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT receiver_id_fk FOREIGN KEY (receiver_id) REFERENCES public.users(id);


--
-- Name: messages sender_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT sender_id_fk FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: saved_projects user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.saved_projects
    ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

