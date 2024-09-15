--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 16.0

-- Started on 2024-05-01 21:34:12 PDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 21 (class 2615 OID 28543)
-- Name: genshin; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA genshin;


ALTER SCHEMA genshin OWNER TO postgres;

--
-- TOC entry 556 (class 1255 OID 29048)
-- Name: add_correct_image_url_q_auto(); Type: FUNCTION; Schema: genshin; Owner: postgres
--

CREATE FUNCTION genshin.add_correct_image_url_q_auto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF NEW.correct_image_url NOT LIKE '%q_auto%' THEN
		NEW.correct_image_url = REPLACE (NEW.correct_image_url, '/upload/', '/upload/q_auto/');
	END IF;
	RETURN NEW;
END;$$;


ALTER FUNCTION genshin.add_correct_image_url_q_auto() OWNER TO postgres;

--
-- TOC entry 555 (class 1255 OID 29046)
-- Name: add_image_url_q_auto(); Type: FUNCTION; Schema: genshin; Owner: postgres
--

CREATE FUNCTION genshin.add_image_url_q_auto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF NEW.image_url NOT LIKE '%q_auto%' THEN
		NEW.image_url = REPLACE (NEW.image_url, '/upload/', '/upload/q_auto/');
	END IF;
	RETURN NEW;
END;$$;


ALTER FUNCTION genshin.add_image_url_q_auto() OWNER TO postgres;

--
-- TOC entry 557 (class 1255 OID 29049)
-- Name: add_wrong_image_url_q_auto(); Type: FUNCTION; Schema: genshin; Owner: postgres
--

CREATE FUNCTION genshin.add_wrong_image_url_q_auto() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF NEW.wrong_image_url NOT LIKE '%q_auto%' THEN
		NEW.wrong_image_url = REPLACE (NEW.wrong_image_url, '/upload/', '/upload/q_auto/');
	END IF;	
	RETURN NEW;
END;$$;


ALTER FUNCTION genshin.add_wrong_image_url_q_auto() OWNER TO postgres;

--
-- TOC entry 554 (class 1255 OID 28987)
-- Name: check_if_date_matches(); Type: FUNCTION; Schema: genshin; Owner: postgres
--

CREATE FUNCTION genshin.check_if_date_matches() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	IF CAST(OLD.date AS DATE) != CAST(CURRENT_TIMESTAMP AT TIME ZONE 'America/Los_Angeles'AS DATE) THEN
		RAISE EXCEPTION 'Attempting to update a daily record from the past.';
	ELSE 
		RETURN NEW;
	END IF;
END;$$;


ALTER FUNCTION genshin.check_if_date_matches() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 280 (class 1259 OID 28638)
-- Name: boss; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.boss (
    id integer NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    region_id integer NOT NULL,
    CONSTRAINT type_normal_or_weekly CHECK ((((type)::text = 'Normal'::text) OR ((type)::text = 'Weekly'::text)))
);


ALTER TABLE genshin.boss OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 28653)
-- Name: boss_drop; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.boss_drop (
    id integer NOT NULL,
    name character varying NOT NULL,
    boss_id integer NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.boss_drop OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 28652)
-- Name: boss_drops_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.boss_drop ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.boss_drops_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 279 (class 1259 OID 28637)
-- Name: bosses_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.boss ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.bosses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 297 (class 1259 OID 28788)
-- Name: character; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin."character" (
    id integer NOT NULL,
    name character varying NOT NULL,
    gender character varying NOT NULL,
    height character varying NOT NULL,
    rarity integer NOT NULL,
    region_id integer,
    element_id integer NOT NULL,
    weapon_type_id integer NOT NULL,
    ascension_stat_id integer NOT NULL,
    local_specialty_id integer NOT NULL,
    enhancement_material_id integer NOT NULL,
    normal_boss_material_id integer,
    weekly_boss_material_id integer NOT NULL,
    special_dish_id integer,
    birthday timestamp without time zone,
    release_date timestamp without time zone NOT NULL,
    release_version numeric NOT NULL,
    image_url text NOT NULL,
    correct_image_url text,
    wrong_image_url text
);


ALTER TABLE genshin."character" OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 28852)
-- Name: character_book_map; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.character_book_map (
    character_id integer NOT NULL,
    talent_book_id integer NOT NULL
);


ALTER TABLE genshin.character_book_map OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 28787)
-- Name: character_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin."character" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.character_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 304 (class 1259 OID 28890)
-- Name: constellation; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.constellation (
    id integer NOT NULL,
    name character varying NOT NULL,
    character_id integer NOT NULL,
    level integer NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.constellation OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 28889)
-- Name: constellation_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.constellation ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.constellation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 307 (class 1259 OID 28922)
-- Name: daily_record; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.daily_record (
    id integer NOT NULL,
    character_id integer NOT NULL,
    character_solved integer NOT NULL,
    talent_id integer NOT NULL,
    talent_solved integer NOT NULL,
    constellation_id integer NOT NULL,
    constellation_solved integer NOT NULL,
    food_id integer NOT NULL,
    food_solved integer NOT NULL,
    weapon_id integer NOT NULL,
    weapon_solved integer NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE genshin.daily_record OWNER TO postgres;

--
-- TOC entry 306 (class 1259 OID 28921)
-- Name: daily_record_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.daily_record ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.daily_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 289 (class 1259 OID 28736)
-- Name: element; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.element (
    id integer NOT NULL,
    name character varying NOT NULL,
    associated_region_id integer NOT NULL
);


ALTER TABLE genshin.element OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 28735)
-- Name: element_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.element ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.element_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 278 (class 1259 OID 28629)
-- Name: enemy_drop; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.enemy_drop (
    id integer NOT NULL,
    name character varying NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.enemy_drop OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 28628)
-- Name: enemy_drops_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.enemy_drop ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.enemy_drops_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 276 (class 1259 OID 28618)
-- Name: enemy_family; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.enemy_family (
    id integer NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    CONSTRAINT type_common_or_elite CHECK ((((type)::text = 'Common'::text) OR ((type)::text = 'Elite'::text)))
);


ALTER TABLE genshin.enemy_family OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 28617)
-- Name: enemy_families_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.enemy_family ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.enemy_families_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 285 (class 1259 OID 28680)
-- Name: enemy_family_drop_map; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.enemy_family_drop_map (
    enemy_family_id integer NOT NULL,
    enemy_drop_id integer NOT NULL
);


ALTER TABLE genshin.enemy_family_drop_map OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 28772)
-- Name: food; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.food (
    id integer NOT NULL,
    name character varying NOT NULL,
    rarity integer NOT NULL,
    type_id integer NOT NULL,
    special_dish boolean NOT NULL,
    purchasable boolean NOT NULL,
    recipe boolean NOT NULL,
    event boolean NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.food OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 28771)
-- Name: food_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.food ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.food_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 293 (class 1259 OID 28763)
-- Name: food_type; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.food_type (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE genshin.food_type OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 28762)
-- Name: food_type_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.food_type ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.food_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 291 (class 1259 OID 28749)
-- Name: local_specialty; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.local_specialty (
    id integer NOT NULL,
    name character varying NOT NULL,
    region_id integer NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.local_specialty OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 28748)
-- Name: local_specialty_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.local_specialty ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.local_specialty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 267 (class 1259 OID 28551)
-- Name: region; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.region (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE genshin.region OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 28574)
-- Name: regions_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.region ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.regions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 274 (class 1259 OID 28595)
-- Name: stat; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.stat (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE genshin.stat OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 28594)
-- Name: stats_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.stat ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.stats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 302 (class 1259 OID 28866)
-- Name: talent; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.talent (
    id integer NOT NULL,
    name character varying NOT NULL,
    character_id integer NOT NULL,
    type_id integer NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.talent OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 28586)
-- Name: talent_book; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.talent_book (
    id integer NOT NULL,
    name character varying NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.talent_book OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 28585)
-- Name: talent_books_ud_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.talent_book ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.talent_books_ud_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 301 (class 1259 OID 28865)
-- Name: talent_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.talent ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.talent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 299 (class 1259 OID 28844)
-- Name: talent_type; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.talent_type (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE genshin.talent_type OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 28843)
-- Name: talent_type_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.talent_type ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.talent_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 287 (class 1259 OID 28694)
-- Name: weapon; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.weapon (
    id integer NOT NULL,
    name character varying NOT NULL,
    rarity integer NOT NULL,
    type_id integer NOT NULL,
    sub_stat_id integer,
    weapon_domain_material_id integer NOT NULL,
    elite_enemy_material_id integer NOT NULL,
    common_enemy_material_id integer NOT NULL,
    gacha boolean NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.weapon OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 28666)
-- Name: weapon_domain_material; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.weapon_domain_material (
    id integer NOT NULL,
    name character varying NOT NULL,
    region_id integer NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE genshin.weapon_domain_material OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 28665)
-- Name: weapon_domain_materials_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.weapon_domain_material ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.weapon_domain_materials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 286 (class 1259 OID 28693)
-- Name: weapon_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.weapon ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.weapon_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 270 (class 1259 OID 28577)
-- Name: weapon_type; Type: TABLE; Schema: genshin; Owner: postgres
--

CREATE TABLE genshin.weapon_type (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE genshin.weapon_type OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 28576)
-- Name: weapon_types_id_seq; Type: SEQUENCE; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.weapon_type ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME genshin.weapon_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3992 (class 0 OID 28638)
-- Dependencies: 280
-- Data for Name: boss; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.boss (id, name, type, region_id) FROM stdin;
1	Anemo Hypostasis	Normal	1
2	Electro Hypostasis	Normal	1
3	Geo Hypostasis	Normal	2
4	Cryo Regisvine	Normal	1
5	Pyro Regisvine	Normal	2
6	Rhodeia of Loch	Normal	2
7	Primo Geovishap	Normal	2
8	Cryo Hypostasis	Normal	1
9	Maguu Kenki	Normal	3
10	Perpetual Mechanical Array	Normal	3
11	Pyro Hypostasis	Normal	3
12	Hydro Hypostasis	Normal	3
13	Thunder Manifestation	Normal	3
14	Golden Wolflord	Normal	3
15	Coral Defenders	Normal	3
16	Ruin Serpent	Normal	2
17	Jadeplume Terrorshroom	Normal	4
18	Electro Regisvine	Normal	4
19	Aeonblight Drake	Normal	4
20	Algorithm of Semi-Intransient Matrix of Overseer Network	Normal	4
21	Dendro Hypostasis	Normal	4
22	Setekh Wenut	Normal	4
23	Iniquitous Baptist	Normal	4
24	Stormterror	Weekly	1
25	Andrius	Weekly	1
26	Childe	Weekly	2
27	Azhdaha	Weekly	2
28	La Signora	Weekly	3
29	Magatsu Mitake Narukami no Mikoto	Weekly	3
30	Everlasting Lord of Arcane Wisdom	Weekly	4
31	Guardian of Apep's Oasis	Weekly	4
32	Icewind Suite	Normal	5
33	Emperor of Fire and Iron	Normal	5
34	Millennial Pearl Seahorse	Normal	5
35	Prototype Cal. Breguet	Normal	5
36	Hydro Tulpa	Normal	5
37	All-Devouring Narwhal	Weekly	5
38	Solitary Suanni	Normal	2
\.


--
-- TOC entry 3994 (class 0 OID 28653)
-- Dependencies: 282
-- Data for Name: boss_drop; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.boss_drop (id, name, boss_id, image_url) FROM stdin;
28	Ring of Boreas	25	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547450/teyvatdle/boss_drop/weekly/ring_of_boreas.png
29	Spirit Locket of Boreas	25	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547488/teyvatdle/boss_drop/weekly/spirit_locket_of_boreas.png
30	Tusk of Monoceros Caeli	26	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547559/teyvatdle/boss_drop/weekly/tusk_of_monoceros_caeli.png
31	Shard of a Foul Legacy	26	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547601/teyvatdle/boss_drop/weekly/shard_of_a_foul_legacy.png
37	Hellfire Butterfly	28	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547843/teyvatdle/boss_drop/weekly/hellfire_butterfly.png
38	Ashen Heart	28	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547885/teyvatdle/boss_drop/weekly/ashen_heart.png
1	Hurricane Seed	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689545662/teyvatdle/boss_drop/normal/hurricane_seed.png
2	Lightning Prism	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689545722/teyvatdle/boss_drop/normal/lightning_prism.png
3	Basalt Pillar	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689545786/teyvatdle/boss_drop/normal/basalt_pillar.png
4	Hoarfrost Core	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689545854/teyvatdle/boss_drop/normal/hoarfrost_core.png
5	Everflame Seed	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689545910/teyvatdle/boss_drop/normal/everflame_seed.png
6	Cleansing Heart	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689545952/teyvatdle/boss_drop/normal/cleansing_heart.png
7	Juvenile Jade	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546005/teyvatdle/boss_drop/normal/juvenile_jade.png
8	Crystalline Bloom	8	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546054/teyvatdle/boss_drop/normal/crystalline_bloom.png
9	Marionette Core	9	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546100/teyvatdle/boss_drop/normal/marionette_core.png
10	Perpetual Heart	10	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546153/teyvatdle/boss_drop/normal/perpetual_heart.png
11	Smoldering Pearl	11	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546200/teyvatdle/boss_drop/normal/smoldering_pearl.png
12	Dew of Repudiation	12	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546239/teyvatdle/boss_drop/normal/dew_of_repudiation.png
13	Storm Beads	13	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546755/teyvatdle/boss_drop/normal/storm_beads.png
14	Riftborn Regalia	14	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546791/teyvatdle/boss_drop/normal/riftborn_regalia.png
15	Dragonheir's False Fin	15	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546830/teyvatdle/boss_drop/normal/dragonheirs_false_fin.png
16	Runic Fang	16	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546884/teyvatdle/boss_drop/normal/runic_fang.png
17	Majestic Hooked Beak	17	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546926/teyvatdle/boss_drop/normal/majestic_hooked_beak.png
18	Thunderclap Fruitcore	18	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689546969/teyvatdle/boss_drop/normal/thunderclap_fruitcore.png
19	Perpetual Caliber	19	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547009/teyvatdle/boss_drop/normal/perpetual_caliber.png
20	Light Guiding Tetrahedron	20	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547046/teyvatdle/boss_drop/normal/light_guiding_tetrahedron.png
21	Quelled Creeper	21	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547101/teyvatdle/boss_drop/normal/quelled_creeper.png
22	Pseudo-Stamens	22	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547137/teyvatdle/boss_drop/normal/pseudo-stamens.png
23	Evergloom Ring	23	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547184/teyvatdle/boss_drop/normal/evergloom_ring.png
24	Dvalin's Plume	24	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547241/teyvatdle/boss_drop/weekly/dvalins_plume.png
25	Dvalin's Claw	24	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547297/teyvatdle/boss_drop/weekly/dvalins_claw.png
26	Dvalin's Sigh	24	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547353/teyvatdle/boss_drop/weekly/dvalins_sigh.png
27	Tail of Boreas	25	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547399/teyvatdle/boss_drop/weekly/tail_of_boreas.png
32	Shadow of the Warrior	26	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547646/teyvatdle/boss_drop/weekly/shadow_of_the_warrior.png
33	Dragon Lord's Crown	27	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547688/teyvatdle/boss_drop/weekly/dragon_lords_crown.png
34	Bloodjade Branch	27	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547729/teyvatdle/boss_drop/weekly/bloodjade_branch.png
35	Gilded Scale	27	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547764/teyvatdle/boss_drop/weekly/gilded_scale.png
36	Molten Moment	28	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547806/teyvatdle/boss_drop/weekly/molten_moment.png
39	Mudra of the Malefic General	29	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547924/teyvatdle/boss_drop/weekly/mudra_of_the_malefic_general.png
40	Tears of the Calamitous God	29	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689547979/teyvatdle/boss_drop/weekly/tears_of_the_calamitous_god.png
41	The Meaning of Aeons	29	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689548026/teyvatdle/boss_drop/weekly/the_meaning_of_aeons.png
42	Puppet Strings	30	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689548070/teyvatdle/boss_drop/weekly/puppet_strings.png
43	Mirror of Mushin	30	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689548105/teyvatdle/boss_drop/weekly/mirror_of_mushin.png
44	Daka's Bell	30	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689548146/teyvatdle/boss_drop/weekly/dakas_bell.png
45	Worldspan Fern	31	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689548189/teyvatdle/boss_drop/weekly/worldspan_fern.png
46	Primordial Greenbloom	31	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689548228/teyvatdle/boss_drop/weekly/primordial_greenbloom.png
47	Everamber	31	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689548270/teyvatdle/boss_drop/weekly/everamber.png
49	Artificed Spare Clockwork Component - Coppelia	32	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692595450/teyvatdle/boss_drop/normal/artificed_spare_clockwork_component-coppelia.png
50	Artificed Spare Clockwork Component - Coppelius	32	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692595505/teyvatdle/boss_drop/normal/artificed_spare_clockwork_component-coppelius.png
51	Emperor's Resolution	33	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692595575/teyvatdle/boss_drop/normal/emperors_resolution.png
52	Fontemer Unihorn	34	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696740327/teyvatdle/boss_drop/normal/fontemer_unihorn.png
53	"Tourbillon Device"	35	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696740404/teyvatdle/boss_drop/normal/tourbillon_device.png
55	Lightless Silk String	37	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701495521/teyvatdle/boss_drop/weekly/lightless_silk_string.png
56	Lightless Eye of the Maelstrom	37	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701495642/teyvatdle/boss_drop/weekly/lightless_eye_of_the_maelstrom.png
57	Lightless Mass	37	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701495722/teyvatdle/boss_drop/weekly/lightless_mass.png
54	Water That Failed To Transcend	36	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701495599/teyvatdle/boss_drop/normal/water_that_failed_to_transcend.png
59	Cloudseam Scale	38	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707630694/teyvatdle/boss_drop/normal/cloudseam_scale.png
\.


--
-- TOC entry 4009 (class 0 OID 28788)
-- Dependencies: 297
-- Data for Name: character; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin."character" (id, name, gender, height, rarity, region_id, element_id, weapon_type_id, ascension_stat_id, local_specialty_id, enhancement_material_id, normal_boss_material_id, weekly_boss_material_id, special_dish_id, birthday, release_date, release_version, image_url, correct_image_url, wrong_image_url) FROM stdin;
32	Ganyu	Female	Medium	5	2	7	5	3	13	7	4	32	235	2020-12-02 00:00:00	2021-01-12 00:00:00	1.2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069623/teyvatdle/character/liyue/ganyu/ganyu.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543768/teyvatdle/character/liyue/ganyu/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543749/teyvatdle/character/liyue/ganyu/wrong.png
7	Fischl	Female	Medium	4	1	3	5	2	5	4	2	29	209	2020-05-27 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005324/teyvatdle/character/mondstadt/fischl/fischl.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545843/teyvatdle/character/mondstadt/fischl/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545820/teyvatdle/character/mondstadt/fischl/wrong.png
30	Zhongli	Male	Tall	5	2	2	3	11	9	1	3	30	244	2020-12-31 00:00:00	2020-12-01 00:00:00	1.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070223/teyvatdle/character/liyue/zhongli/zhongli.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545021/teyvatdle/character/liyue/zhongli/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544998/teyvatdle/character/liyue/zhongli/wrong.png
72	Kaveh	Male	Tall	4	4	4	2	9	28	10	21	46	252	2020-07-09 00:00:00	2023-05-02 00:00:00	3.6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071250/teyvatdle/character/sumeru/kaveh/kaveh.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629070/teyvatdle/character/sumeru/kaveh/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629024/teyvatdle/character/sumeru/kaveh/wrong.png
62	Nilou	Female	Medium	5	4	5	1	13	30	10	19	40	250	2020-12-03 00:00:00	2022-10-14 00:00:00	3.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071392/teyvatdle/character/sumeru/nilou/nilou.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629236/teyvatdle/character/sumeru/nilou/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629232/teyvatdle/character/sumeru/nilou/wrong.png
20	Traveler (Geo)	Other	Medium	5	\N	2	1	2	7	4	\N	27	\N	\N	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690072095/teyvatdle/character/other/traveler_geo/traveler_geo.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629853/teyvatdle/character/other/traveler_geo/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629848/teyvatdle/character/other/traveler_geo/wrong.png
3	Beidou	Female	Tall	4	2	3	2	8	12	6	2	26	218	2020-02-14 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069545/teyvatdle/character/liyue/beidou/beidou.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693634690/teyvatdle/character/liyue/beidou/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693634681/teyvatdle/character/liyue/beidou/wrong.png
33	Xiao	Male	Medium	5	2	1	3	4	13	1	7	32	197	2020-04-17 00:00:00	2021-02-03 00:00:00	1.3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069928/teyvatdle/character/liyue/xiao/xiao.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544620/teyvatdle/character/liyue/xiao/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544602/teyvatdle/character/liyue/xiao/wrong.png
23	Venti	Male	Medium	5	1	1	5	10	2	1	1	27	199	2020-06-16 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690006317/teyvatdle/character/mondstadt/venti/venti.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628507/teyvatdle/character/mondstadt/venti/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628494/teyvatdle/character/mondstadt/venti/wrong.png
36	Yanfei	Female	Medium	4	2	6	4	16	12	6	7	34	194	2020-07-28 00:00:00	2021-04-28 00:00:00	1.5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070055/teyvatdle/character/liyue/yanfei/yanfei.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544797/teyvatdle/character/liyue/yanfei/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544778/teyvatdle/character/liyue/yanfei/wrong.png
54	Yelan	Female	Tall	5	2	5	5	4	15	5	16	35	208	2020-04-20 00:00:00	2022-05-31 00:00:00	2.7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070135/teyvatdle/character/liyue/yelan/yelan.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544915/teyvatdle/character/liyue/yelan/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544894/teyvatdle/character/liyue/yelan/wrong.png
47	Arataki Itto	Male	Tall	5	3	2	2	4	22	1	14	38	258	2020-06-01 00:00:00	2021-12-14 00:00:00	2.3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070287/teyvatdle/character/inazuma/arataki_itto/arataki_itto.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542153/teyvatdle/character/inazuma/arataki_itto/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542128/teyvatdle/character/inazuma/arataki_itto/wrong.png
73	Kirara	Female	Medium	4	3	4	1	13	17	9	23	47	213	2020-01-22 00:00:00	2023-05-24 00:00:00	3.7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070513/teyvatdle/character/inazuma/kirara/kirara.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542732/teyvatdle/character/inazuma/kirara/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542717/teyvatdle/character/inazuma/kirara/wrong.png
70	Mika	Male	Medium	4	1	7	3	13	8	5	22	43	248	2020-08-11 00:00:00	2023-03-21 00:00:00	3.5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690006063/teyvatdle/character/mondstadt/mika/mika.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693546167/teyvatdle/character/mondstadt/mika/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693546157/teyvatdle/character/mondstadt/mika/wrong.png
81	Freminet	Male	Medium	4	5	7	2	2	38	79	50	45	304	2020-09-24 00:00:00	2023-09-05 00:00:00	4.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694146672/teyvatdle/character/fontaine/freminet/freminet.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694146709/teyvatdle/character/fontaine/freminet/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694146712/teyvatdle/character/fontaine/freminet/wrong.png
35	Rosaria	Female	Tall	4	1	7	3	2	6	5	4	32	210	2020-01-24 00:00:00	2021-04-06 00:00:00	1.4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690006230/teyvatdle/character/mondstadt/rosaria/rosaria.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628416/teyvatdle/character/mondstadt/rosaria/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628390/teyvatdle/character/mondstadt/rosaria/wrong.png
31	Albedo	Male	Medium	5	1	2	1	11	2	3	3	30	259	2020-09-13 00:00:00	2020-12-23 00:00:00	1.2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690004963/teyvatdle/character/mondstadt/albedo/albedo.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545098/teyvatdle/character/mondstadt/albedo/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545061/teyvatdle/character/mondstadt/albedo/wrong.png
49	Shenhe	Female	Tall	5	2	7	3	2	13	7	15	37	225	2020-03-10 00:00:00	2022-01-05 00:00:00	2.4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069849/teyvatdle/character/liyue/shenhe/shenhe.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544498/teyvatdle/character/liyue/shenhe/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544481/teyvatdle/character/liyue/shenhe/wrong.png
55	Kuki Shinobu	Female	Medium	4	3	3	1	13	21	9	16	40	233	2020-07-27 00:00:00	2022-06-21 00:00:00	2.7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070597/teyvatdle/character/inazuma/kuki_shinobu/kuki_shinobu.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542832/teyvatdle/character/inazuma/kuki_shinobu/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542817/teyvatdle/character/inazuma/kuki_shinobu/wrong.png
56	Shikanoin Heizou	Male	Medium	4	3	1	4	1	22	6	16	41	253	2020-07-24 00:00:00	2022-07-13 00:00:00	2.8	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070773/teyvatdle/character/inazuma/shikanoin_heizou/shikanoin_heizou.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543063/teyvatdle/character/inazuma/shikanoin_heizou/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543048/teyvatdle/character/inazuma/shikanoin_heizou/wrong.png
67	Alhaitham	Male	Tall	5	4	4	1	7	32	11	22	43	227	2020-02-11 00:00:00	2023-01-18 00:00:00	3.4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070956/teyvatdle/character/sumeru/alhaitham/alhaitham.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628622/teyvatdle/character/sumeru/alhaitham/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628599/teyvatdle/character/sumeru/alhaitham/wrong.png
69	Dehya	Female	Tall	5	4	6	2	13	32	11	20	42	223	2020-04-07 00:00:00	2023-03-01 00:00:00	3.5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071127/teyvatdle/character/sumeru/dehya/dehya.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628851/teyvatdle/character/sumeru/dehya/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628835/teyvatdle/character/sumeru/dehya/wrong.png
64	Layla	Female	Medium	4	4	7	1	13	29	3	19	43	215	2020-12-19 00:00:00	2022-11-18 00:00:00	3.2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071313/teyvatdle/character/sumeru/layla/layla.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629125/teyvatdle/character/sumeru/layla/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629121/teyvatdle/character/sumeru/layla/wrong.png
42	Aloy	Female	Medium	4	\N	7	5	5	18	9	8	36	241	2020-04-04 00:00:00	2021-09-01 00:00:00	2.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071630/teyvatdle/character/other/aloy/aloy.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693721168/teyvatdle/character/other/aloy/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693721171/teyvatdle/character/other/aloy/wrong.png
37	Eula	Female	Tall	5	1	7	2	3	3	2	8	33	246	2020-10-25 00:00:00	2021-05-18 00:00:00	1.5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005282/teyvatdle/character/mondstadt/eula/eula.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545672/teyvatdle/character/mondstadt/eula/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545638/teyvatdle/character/mondstadt/eula/wrong.png
9	Kaeya	Male	Tall	4	1	7	1	10	1	6	4	29	220	2020-11-30 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005404/teyvatdle/character/mondstadt/kaeya/kaeya.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545987/teyvatdle/character/mondstadt/kaeya/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545977/teyvatdle/character/mondstadt/kaeya/wrong.png
11	Lisa	Female	Tall	4	1	3	4	9	6	1	2	25	230	2020-06-09 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690006005/teyvatdle/character/mondstadt/lisa/lisa.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693546115/teyvatdle/character/mondstadt/lisa/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693630044/teyvatdle/character/mondstadt/lisa/wrong.png
16	Razor	Male	Medium	4	1	3	2	15	8	2	2	25	236	2020-09-09 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690006182/teyvatdle/character/mondstadt/razor/razor.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628355/teyvatdle/character/mondstadt/razor/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628343/teyvatdle/character/mondstadt/razor/wrong.png
17	Sucrose	Female	Medium	4	1	1	4	1	7	7	1	29	232	2020-11-26 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690006277/teyvatdle/character/mondstadt/sucrose/sucrose.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628466/teyvatdle/character/mondstadt/sucrose/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628447/teyvatdle/character/mondstadt/sucrose/wrong.png
50	Yun Jin	Female	Medium	4	2	2	3	10	10	2	14	38	204	2020-05-21 00:00:00	2022-01-05 00:00:00	2.4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070183/teyvatdle/character/liyue/yun_jin/yun_jin.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544962/teyvatdle/character/liyue/yun_jin/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544942/teyvatdle/character/liyue/yun_jin/wrong.png
38	Kaedehara Kazuha	Male	Medium	5	3	1	1	9	25	6	9	35	203	2020-10-29 00:00:00	2021-06-29 00:00:00	1.6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070379/teyvatdle/character/inazuma/kaedehara_kazuha/kaedehara_kazuha.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542593/teyvatdle/character/inazuma/kaedehara_kazuha/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542528/teyvatdle/character/inazuma/kaedehara_kazuha/wrong.png
53	Kamisato Ayato	Male	Tall	5	3	5	1	3	23	8	12	39	239	2020-03-26 00:00:00	2022-03-30 00:00:00	2.6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070466/teyvatdle/character/inazuma/kamisato_ayato/kamisato_ayato.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542692/teyvatdle/character/inazuma/kamisato_ayato/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542677/teyvatdle/character/inazuma/kamisato_ayato/wrong.png
44	Raiden Shogun	Female	Tall	5	3	3	3	10	17	8	13	36	\N	2020-06-26 00:00:00	2021-09-01 00:00:00	2.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070635/teyvatdle/character/inazuma/raiden_shogun/raiden_shogun.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542901/teyvatdle/character/inazuma/raiden_shogun/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542885/teyvatdle/character/inazuma/raiden_shogun/wrong.png
46	Thoma	Male	Tall	4	3	6	3	2	20	6	11	37	198	2020-01-09 00:00:00	2021-11-02 00:00:00	2.2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070813/teyvatdle/character/inazuma/thoma/thoma.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543123/teyvatdle/character/inazuma/thoma/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543096/teyvatdle/character/inazuma/thoma/wrong.png
60	Candace	Female	Tall	4	4	5	3	13	26	11	20	40	255	2020-05-03 00:00:00	2022-09-28 00:00:00	3.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070994/teyvatdle/character/sumeru/candace/candace.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628674/teyvatdle/character/sumeru/candace/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628657/teyvatdle/character/sumeru/candace/wrong.png
63	Nahida	Female	Short	5	4	4	4	9	27	10	21	42	224	2020-10-27 00:00:00	2022-11-02 00:00:00	3.2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071350/teyvatdle/character/sumeru/nahida/nahida.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629191/teyvatdle/character/sumeru/nahida/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629187/teyvatdle/character/sumeru/nahida/wrong.png
66	Wanderer	Male	Medium	5	4	1	4	4	31	8	19	44	242	2020-01-03 00:00:00	2022-12-07 00:00:00	3.3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071480/teyvatdle/character/sumeru/wanderer/wanderer.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629372/teyvatdle/character/sumeru/wanderer/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629368/teyvatdle/character/sumeru/wanderer/wrong.png
75	Lyney	Male	Medium	5	5	6	5	4	37	5	51	46	284	2020-02-02 00:00:00	2023-08-16 00:00:00	4.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692768116/teyvatdle/character/fontaine/lyney/lyney.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693459792/teyvatdle/character/fontaine/lyney/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693459774/teyvatdle/character/fontaine/lyney/wrong.png
78	Traveler (Hydro)	Other	Medium	5	\N	5	1	2	7	79	\N	45	\N	\N	2023-08-16 00:00:00	4.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852555/teyvatdle/character/other/traveler_hydro/traveler_hydro.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629833/teyvatdle/character/other/traveler_hydro/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629858/teyvatdle/character/other/traveler_hydro/wrong.png
24	Xiangling	Female	Medium	4	2	6	3	9	11	1	5	25	257	2020-11-02 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069890/teyvatdle/character/liyue/xiangling/xiangling.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544555/teyvatdle/character/liyue/xiangling/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693630398/teyvatdle/character/liyue/xiangling/wrong.png
10	Keqing	Female	Medium	5	2	3	1	3	9	7	2	28	249	2020-11-20 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069716/teyvatdle/character/liyue/keqing/keqing.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544254/teyvatdle/character/liyue/keqing/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544238/teyvatdle/character/liyue/keqing/wrong.png
25	Xingqiu	Male	Medium	4	2	5	1	2	14	2	6	27	202	2020-10-09 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069966/teyvatdle/character/liyue/xingqiu/xingqiu.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544665/teyvatdle/character/liyue/xingqiu/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544649/teyvatdle/character/liyue/xingqiu/wrong.png
29	Xinyan	Female	Medium	4	2	6	2	2	16	6	5	30	240	2020-10-16 00:00:00	2020-12-01 00:00:00	1.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070005/teyvatdle/character/liyue/xinyan/xinyan.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544719/teyvatdle/character/liyue/xinyan/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544700/teyvatdle/character/liyue/xinyan/wrong.png
68	Yaoyao	Female	Short	4	2	4	3	13	11	1	21	44	238	2020-03-06 00:00:00	2023-01-18 00:00:00	3.4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070097/teyvatdle/character/liyue/yaoyao/yaoyao.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544859/teyvatdle/character/liyue/yaoyao/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544831/teyvatdle/character/liyue/yaoyao/wrong.png
41	Yoimiya	Female	Medium	5	3	6	5	4	21	3	11	33	247	2020-06-21 00:00:00	2021-08-10 00:00:00	2.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070893/teyvatdle/character/inazuma/yoimiya/yoimiya.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693720635/teyvatdle/character/inazuma/yoimiya/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543229/teyvatdle/character/inazuma/yoimiya/wrong.png
58	Tighnari	Male	Medium	5	4	4	5	7	29	10	17	41	219	2020-12-29 00:00:00	2022-08-24 00:00:00	3.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071437/teyvatdle/character/sumeru/tighnari/tighnari.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629318/teyvatdle/character/sumeru/tighnari/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629283/teyvatdle/character/sumeru/tighnari/wrong.png
28	Childe	Male	Tall	5	7	5	5	14	15	5	6	31	200	2020-07-20 00:00:00	2020-11-11 00:00:00	1.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071556/teyvatdle/character/snezhnaya/childe/childe.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628564/teyvatdle/character/snezhnaya/childe/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628543/teyvatdle/character/snezhnaya/childe/wrong.png
74	Lynette	Female	Medium	4	5	1	1	1	36	80	49	47	281	2020-02-02 00:00:00	2023-08-16 00:00:00	4.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692768083/teyvatdle/character/fontaine/lynette/lynette.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693459751/teyvatdle/character/fontaine/lynette/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693459732/teyvatdle/character/fontaine/lynette/wrong.png
19	Traveler (Anemo)	Other	Medium	5	\N	1	1	2	7	3	\N	26	\N	\N	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690072024/teyvatdle/character/other/traveler_anemo/traveler_anemo.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629470/teyvatdle/character/other/traveler_anemo/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629465/teyvatdle/character/other/traveler_anemo/wrong.png
21	Traveler (Electro)	Other	Medium	5	\N	3	1	2	7	8	\N	33	\N	\N	2021-07-21 00:00:00	2.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690072218/teyvatdle/character/other/traveler_electro/traveler_electro.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629843/teyvatdle/character/other/traveler_electro/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629824/teyvatdle/character/other/traveler_electro/wrong.png
48	Gorou	Male	Medium	4	3	2	5	11	24	9	10	36	256	2020-05-18 00:00:00	2021-12-14 00:00:00	2.3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070336/teyvatdle/character/inazuma/gorou/gorou.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542465/teyvatdle/character/inazuma/gorou/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542373/teyvatdle/character/inazuma/gorou/wrong.png
39	Kamisato Ayaka	Female	Medium	5	3	7	1	3	23	8	10	34	196	2020-09-28 00:00:00	2021-07-21 00:00:00	2.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070419/teyvatdle/character/inazuma/kamisato_ayaka/kamisato_ayaka.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693720208/teyvatdle/character/inazuma/kamisato_ayaka/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542625/teyvatdle/character/inazuma/kamisato_ayaka/wrong.png
43	Kujou Sara	Female	Tall	4	3	3	5	2	19	2	13	38	216	2020-07-14 00:00:00	2021-09-01 00:00:00	2.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070554/teyvatdle/character/inazuma/kujou_sara/kujou_sara.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542787/teyvatdle/character/inazuma/kujou_sara/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542766/teyvatdle/character/inazuma/kujou_sara/wrong.png
1	Amber	Female	Medium	4	1	6	5	2	5	4	5	26	234	2020-08-10 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005044/teyvatdle/character/mondstadt/amber/amber.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693630190/teyvatdle/character/mondstadt/amber/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545151/teyvatdle/character/mondstadt/amber/wrong.png
57	Collei	Female	Medium	4	4	4	5	2	31	4	17	40	260	2020-05-08 00:00:00	2022-08-24 00:00:00	3.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071040/teyvatdle/character/sumeru/collei/collei.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693888755/teyvatdle/character/sumeru/collei/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628714/teyvatdle/character/sumeru/collei/wrong.png
82	Neuvillette	Male	Tall	5	5	5	4	3	39	79	52	47	305	2020-12-18 00:00:00	2023-09-27 00:00:00	4.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696742584/teyvatdle/character/fontaine/neuvillette/neuvillette.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696742641/teyvatdle/character/fontaine/neuvillette/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863931/teyvatdle/character/fontaine/neuvillette/wrong.png
88	Xianyun	Female	Tall	5	2	1	4	2	43	3	59	56	335	2020-04-11 00:00:00	2024-01-31 00:00:00	4.4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632570/teyvatdle/character/liyue/xianyun/xianyun.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632663/teyvatdle/character/liyue/xianyun/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632695/teyvatdle/character/liyue/xianyun/wrong.png
89	Gaming	Male	Medium	4	2	6	2	2	15	1	51	57	341	2020-12-22 00:00:00	2024-01-31 00:00:00	4.4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632615/teyvatdle/character/liyue/gaming/gaming.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632782/teyvatdle/character/liyue/gaming/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632801/teyvatdle/character/liyue/gaming/wrong.png
71	Baizhu	Male	Tall	5	2	4	4	13	16	10	23	45	226	2020-04-25 00:00:00	2023-05-02 00:00:00	3.6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069494/teyvatdle/character/liyue/baizhu/baizhu.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693634621/teyvatdle/character/liyue/baizhu/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693634629/teyvatdle/character/liyue/baizhu/wrong.png
61	Cyno	Male	Medium	5	4	3	3	3	33	3	18	39	212	2020-06-23 00:00:00	2022-09-28 00:00:00	3.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071085/teyvatdle/character/sumeru/cyno/cyno.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628799/teyvatdle/character/sumeru/cyno/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628780/teyvatdle/character/sumeru/cyno/wrong.png
83	Wriothesley	Male	Tall	5	5	7	4	3	40	80	53	46	317	2020-11-23 00:00:00	2023-10-17 00:00:00	4.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862283/teyvatdle/character/fontaine/wriothesley/wriothesley.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862408/teyvatdle/character/fontaine/wriothesley/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862425/teyvatdle/character/fontaine/wriothesley/wrong.png
90	Chiori	Female	Medium	5	3	2	1	4	19	9	49	55	342	2020-08-17 00:00:00	2024-03-13 00:00:00	4.5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258363/teyvatdle/character/inazuma/chiori/chiori.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258308/teyvatdle/character/inazuma/chiori/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258315/teyvatdle/character/inazuma/chiori/wrong.png
65	Faruzan	Female	Medium	4	4	1	5	2	26	11	20	42	254	2020-08-20 00:00:00	2022-12-07 00:00:00	3.3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071210/teyvatdle/character/sumeru/faruzan/faruzan.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628974/teyvatdle/character/sumeru/faruzan/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628971/teyvatdle/character/sumeru/faruzan/wrong.png
6	Diluc	Male	Tall	5	1	6	2	4	5	5	5	24	195	2020-04-30 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005203/teyvatdle/character/mondstadt/diluc/diluc.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545547/teyvatdle/character/mondstadt/diluc/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693630109/teyvatdle/character/mondstadt/diluc/wrong.png
13	Ningguang	Female	Tall	4	2	2	4	11	10	5	3	29	237	2020-08-26 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069752/teyvatdle/character/liyue/ningguang/ningguang.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544376/teyvatdle/character/liyue/ningguang/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693630287/teyvatdle/character/liyue/ningguang/wrong.png
4	Bennett	Male	Medium	4	1	6	1	10	7	6	5	24	251	2020-02-29 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005165/teyvatdle/character/mondstadt/bennett/bennett.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545481/teyvatdle/character/mondstadt/bennett/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693630135/teyvatdle/character/mondstadt/bennett/wrong.png
27	Diona	Female	Short	4	1	7	5	5	1	4	4	31	206	2020-01-18 00:00:00	2020-11-11 00:00:00	1.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005241/teyvatdle/character/mondstadt/diona/diona.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545604/teyvatdle/character/mondstadt/diona/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545585/teyvatdle/character/mondstadt/diona/wrong.png
2	Barbara	Female	Medium	4	1	5	4	13	4	3	6	28	245	2020-07-05 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005122/teyvatdle/character/mondstadt/barbara/barbara.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545381/teyvatdle/character/mondstadt/barbara/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545370/teyvatdle/character/mondstadt/barbara/wrong.png
5	Chongyun	Male	Medium	4	2	7	2	2	9	2	4	26	205	2020-09-07 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069583/teyvatdle/character/liyue/chongyun/chongyun.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863569/teyvatdle/character/liyue/chongyun/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543694/teyvatdle/character/liyue/chongyun/wrong.png
14	Noelle	Female	Medium	4	1	2	2	6	6	2	3	25	229	2020-03-21 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690006140/teyvatdle/character/mondstadt/noelle/noelle.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863669/teyvatdle/character/mondstadt/noelle/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628283/teyvatdle/character/mondstadt/noelle/wrong.png
84	Furina	Female	Medium	5	5	5	1	4	41	7	54	57	318	2020-10-13 00:00:00	2023-11-08 00:00:00	4.2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701497667/teyvatdle/character/fontaine/furina/furina.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701497832/teyvatdle/character/fontaine/furina/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701497869/teyvatdle/character/fontaine/furina/wrong.png
85	Charlotte	Female	Medium	4	5	7	4	2	35	80	53	55	320	2020-04-10 00:00:00	2023-11-08 00:00:00	4.2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498221/teyvatdle/character/fontaine/charlotte/charlotte.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498264/teyvatdle/character/fontaine/charlotte/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498288/teyvatdle/character/fontaine/charlotte/wrong.png
59	Dori	Female	Short	4	4	3	2	13	27	11	18	34	243	2020-12-21 00:00:00	2022-09-09 00:00:00	3.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690071165/teyvatdle/character/sumeru/dori/dori.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628935/teyvatdle/character/sumeru/dori/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693628913/teyvatdle/character/sumeru/dori/wrong.png
86	Navia	Female	Tall	5	5	2	2	3	42	79	50	55	326	2020-08-16 00:00:00	2023-12-20 00:00:00	4.3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705213161/teyvatdle/character/fontaine/navia/navia.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705213206/teyvatdle/character/fontaine/navia/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705213222/teyvatdle/character/fontaine/navia/wrong.png
87	Chevreuse	Female	Medium	4	5	6	3	13	36	80	52	56	330	2020-01-10 00:00:00	2024-01-09 00:00:00	4.3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705213289/teyvatdle/character/fontaine/chevreuse/chevreuse.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705213320/teyvatdle/character/fontaine/chevreuse/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705213336/teyvatdle/character/fontaine/chevreuse/wrong.png
8	Jean	Female	Tall	5	1	1	1	12	3	2	1	24	228	2020-03-14 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005369/teyvatdle/character/mondstadt/jean/jean.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545938/teyvatdle/character/mondstadt/jean/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693545929/teyvatdle/character/mondstadt/jean/wrong.png
26	Klee	Female	Short	5	1	6	4	16	4	3	5	28	217	2020-07-27 00:00:00	2020-10-20 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690005953/teyvatdle/character/mondstadt/klee/klee.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693546066/teyvatdle/character/mondstadt/klee/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693546057/teyvatdle/character/mondstadt/klee/wrong.png
12	Mona	Female	Medium	5	1	5	4	10	4	7	6	28	207	2020-08-31 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690006103/teyvatdle/character/mondstadt/mona/mona.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693627983/teyvatdle/character/mondstadt/mona/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693627965/teyvatdle/character/mondstadt/mona/wrong.png
22	Traveler (Dendro)	Other	Medium	5	\N	4	1	2	7	10	\N	39	\N	\N	2022-08-23 00:00:00	3.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690072288/teyvatdle/character/other/traveler_dendro/traveler_dendro.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629838/teyvatdle/character/other/traveler_dendro/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693629811/teyvatdle/character/other/traveler_dendro/wrong.png
34	Hu Tao	Female	Medium	5	2	6	3	3	14	7	7	31	222	2020-07-15 00:00:00	2021-03-02 00:00:00	1.3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069674/teyvatdle/character/liyue/hu_tao/hu_tao.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544199/teyvatdle/character/liyue/hu_tao/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544184/teyvatdle/character/liyue/hu_tao/wrong.png
15	Qiqi	Female	Short	5	2	7	1	12	16	3	4	27	231	2020-03-03 00:00:00	2020-09-28 00:00:00	1.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690069797/teyvatdle/character/liyue/qiqi/qiqi.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693630345/teyvatdle/character/liyue/qiqi/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693544428/teyvatdle/character/liyue/qiqi/wrong.png
45	Sangonomiya Kokomi	Female	Medium	5	3	5	4	14	24	9	12	37	201	2020-02-22 00:00:00	2021-09-21 00:00:00	2.1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070676/teyvatdle/character/inazuma/sangonomiya_kokomi/sangonomiya_kokomi.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542956/teyvatdle/character/inazuma/sangonomiya_kokomi/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693542936/teyvatdle/character/inazuma/sangonomiya_kokomi/wrong.png
40	Sayu	Female	Short	4	3	1	2	9	18	7	9	35	211	2020-10-19 00:00:00	2021-08-10 00:00:00	2.0	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070731/teyvatdle/character/inazuma/sayu/sayu.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693720437/teyvatdle/character/inazuma/sayu/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693720435/teyvatdle/character/inazuma/sayu/wrong.png
51	Yae Miko	Female	Tall	5	3	3	4	4	25	8	15	41	221	2020-06-27 00:00:00	2022-02-16 00:00:00	2.5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690070853/teyvatdle/character/inazuma/yae_miko/yae_miko.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543186/teyvatdle/character/inazuma/yae_miko/correct.png	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1693543166/teyvatdle/character/inazuma/yae_miko/wrong.png
\.


--
-- TOC entry 4012 (class 0 OID 28852)
-- Dependencies: 300
-- Data for Name: character_book_map; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.character_book_map (character_id, talent_book_id) FROM stdin;
1	1
2	1
3	6
4	2
5	5
6	2
7	3
8	2
9	3
10	4
11	3
12	2
13	4
14	2
15	4
16	2
17	1
19	1
19	2
19	3
20	4
20	5
20	6
21	7
21	8
21	9
22	10
22	11
22	12
23	3
24	5
25	6
26	1
27	1
28	1
29	6
30	6
31	3
32	5
33	4
34	5
35	3
36	6
37	2
38	5
39	8
40	9
41	7
42	1
43	8
44	9
45	7
46	7
47	8
48	9
49	4
50	5
51	9
53	8
54	4
55	8
56	7
57	12
58	10
59	11
60	10
61	10
62	12
63	11
64	11
65	10
66	12
67	11
68	5
69	12
70	3
71	6
72	11
73	7
74	15
75	13
78	13
78	14
78	15
81	14
82	13
83	15
84	14
85	14
86	13
87	15
88	6
89	4
90	9
\.


--
-- TOC entry 4016 (class 0 OID 28890)
-- Dependencies: 304
-- Data for Name: constellation; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.constellation (id, name, character_id, level, image_url) FROM stdin;
111	Sweeping Gust	19	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610997/teyvatdle/character/other/traveler_anemo/constellation/sweeping_gust.png
115	Invincible Stonewall	20	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611186/teyvatdle/character/other/traveler_geo/constellation/invincible_stonewall.png
118	Reaction Force	20	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611284/teyvatdle/character/other/traveler_geo/constellation/reaction_force.png
122	Violet Vehemence	21	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611442/teyvatdle/character/other/traveler_electro/constellation/violet_vehemence.png
126	World-Shaker	21	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611582/teyvatdle/character/other/traveler_electro/constellation/world-shaker.png
129	Whirling Weeds	22	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611708/teyvatdle/character/other/traveler_dendro/constellation/whirling_weeds.png
4	It's Not Just Any Doll...	1	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347699/teyvatdle/character/mondstadt/amber/constellation/its_not_just_any_doll.png
8	Vitality Burst	2	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347873/teyvatdle/character/mondstadt/barbara/constellation/vitality_burst.png
12	Dedicating Everything to You	2	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348021/teyvatdle/character/mondstadt/barbara/constellation/dedicating_everything_to_you.png
21	Unstoppable Fervor	4	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348157/teyvatdle/character/mondstadt/bennett/constellation/unstoppable_fervor.png
31	Conviction	6	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348343/teyvatdle/character/mondstadt/diluc/constellation/conviction.png
34	Flowing Flame	6	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348474/teyvatdle/character/mondstadt/diluc/constellation/flowing_flame.png
38	Devourer of All Sins	7	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349283/teyvatdle/character/mondstadt/fischl/constellation/devourer_of_all_sins.png
42	Evernight Raven	7	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690431796/teyvatdle/character/mondstadt/fischl/constellation/evernight_raven.png
45	When the West Wind Arises	8	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690431936/teyvatdle/character/mondstadt/jean/constellation/when_the_west_wind_arises.png
49	Excellent Blood	9	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432126/teyvatdle/character/mondstadt/kaeya/constellation/excellent_blood.png
52	Frozen Kiss	9	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432237/teyvatdle/character/mondstadt/kaeya/constellation/frozen_kiss.png
61	Infinite Circuit	11	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432612/teyvatdle/character/mondstadt/lisa/constellation/infinite_circuit.png
65	Electrocute	11	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432763/teyvatdle/character/mondstadt/lisa/constellation/electrocute.png
68	Lunar Chain	12	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433145/teyvatdle/character/mondstadt/mona/constellation/lunar_chain.png
79	I Got Your Back	14	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433381/teyvatdle/character/mondstadt/noelle/constellation/i_got_your_back.png
81	Invulnerable Maid	14	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433457/teyvatdle/character/mondstadt/noelle/constellation/invulnerable_maid.png
97	Wolf's Instinct	16	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433641/teyvatdle/character/mondstadt/razor/constellation/wolfs_instinct.png
100	Bite	16	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433745/teyvatdle/character/mondstadt/razor/constellation/bite.png
104	Beth: Unbound Form	17	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434154/teyvatdle/character/mondstadt/sucrose/constellation/beth_unbound_form.png
108	Chaotic Entropy	17	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434312/teyvatdle/character/mondstadt/sucrose/constellation/chaotic_entropy.png
135	Ode to Thousand Winds	23	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434444/teyvatdle/character/mondstadt/venti/constellation/ode_to_thousand_winds.png
15	Summoner of Storm	3	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434952/teyvatdle/character/liyue/beidou/constellation/summoner_of_storm.png
18	Bane of Evil	3	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435063/teyvatdle/character/liyue/beidou/constellation/bane_of_evil.png
27	Cloudburst	5	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435183/teyvatdle/character/liyue/chongyun/constellation/cloudburst.png
55	Thundering Might	10	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517462/teyvatdle/character/liyue/keqing/constellation/thundering_might.png
58	Attunement	10	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517576/teyvatdle/character/liyue/keqing/constellation/attunement.png
74	Shock Effect	13	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517743/teyvatdle/character/liyue/ningguang/constellation/shock_effect.png
77	Invincible Be the Jade Screen	13	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517885/teyvatdle/character/liyue/ningguang/constellation/invincible_be_the_jade_screen.png
92	Frozen to the Bone	15	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518033/teyvatdle/character/liyue/qiqi/constellation/frozen_to_the_bone.png
95	Crimson Lotus Bloom	15	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518149/teyvatdle/character/liyue/qiqi/constellation/crimson_lotus_bloom.png
141	Deepfry	24	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518658/teyvatdle/character/liyue/xiangling/constellation/deepfry.png
194	Annihilation Eon: Blossom of Kaleidos	33	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518859/teyvatdle/character/liyue/xiao/constellation/annihilation_eon_blossom_of_kaleidos.png
197	Evolution Eon: Origin of Ignorance	33	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519131/teyvatdle/character/liyue/xiao/constellation/evolution_eon_origin_of_ignorance.png
146	Rainbow Upon the Azure Sky	25	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519262/teyvatdle/character/liyue/xingqiu/constellation/rainbow_upon_the_azure_sky.png
163	Foul Legacy: Tide Withholder	28	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610629/teyvatdle/character/snezhnaya/childe/constellation/foul_legacy_tide_withholder.png
164	Foul Legacy: Understream	28	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610667/teyvatdle/character/snezhnaya/childe/constellation/foul_legacy_understream.png
166	Abyssal Mayhem: Hydrospout	28	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610744/teyvatdle/character/snezhnaya/childe/constellation/abyssal_mayhem_hydrospout.png
150	Hence, Call Them My Own Verses	25	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519427/teyvatdle/character/liyue/xingqiu/constellation/hence_call_them_my_own_verses.png
171	Double-Stop	29	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519591/teyvatdle/character/liyue/xinyan/constellation/double-stop.png
211	The Law Knows No Kindness	36	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519757/teyvatdle/character/liyue/yanfei/constellation/the_law_knows_no_kindness.png
214	Supreme Amnesty	36	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519867/teyvatdle/character/liyue/yanfei/constellation/supreme_amnesty.png
176	Stone, the Cradle of Jade	30	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520768/teyvatdle/character/liyue/zhongli/constellation/stone_the_cradle_of_jade.png
179	Lazuli, Herald of the Order	30	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520892/teyvatdle/character/liyue/zhongli/constellation/lazuli_herald_of_the_order.png
224	Yamaarashi Tailwind	38	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521564/teyvatdle/character/inazuma/kaedehara_kazuha/constellation/yamaarashi_tailwind.png
228	Crimson Momiji	38	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521705/teyvatdle/character/inazuma/kaedehara_kazuha/constellation/crimson_momiji.png
232	Ebb and Flow	39	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521860/teyvatdle/character/inazuma/kamisato_ayaka/constellation/ebb_and_flow.png
253	Crow's Eye	43	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604183/teyvatdle/character/inazuma/kujou_sara/constellation/crows_eye.png
256	Conclusive Proof	43	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604322/teyvatdle/character/inazuma/kujou_sara/constellation/conclusive_proof.png
260	Steelbreaker	44	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604764/teyvatdle/character/inazuma/raiden_shogun/constellation/steelbreaker.png
264	Wishbearer	44	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604914/teyvatdle/character/inazuma/raiden_shogun/constellation/wishbearer.png
236	Egress Prep	40	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605296/teyvatdle/character/inazuma/sayu/constellation/egress_prep.png
239	Speed Comes First	40	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605445/teyvatdle/character/inazuma/sayu/constellation/speed_comes_first.png
243	Trickster's Flare	41	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606588/teyvatdle/character/inazuma/yoimiya/constellation/tricksters_flare.png
246	Naganohara Meteor Swarm	41	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606711/teyvatdle/character/inazuma/yoimiya/constellation/naganohara_meteor_swarm.png
185	Tide of Hadean	31	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347474/teyvatdle/character/mondstadt/albedo/constellation/tide_of_hadean.png
158	Shaken, Not Purred	27	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348679/teyvatdle/character/mondstadt/diona/constellation/shaken_not_purred.png
162	Cat's Tail Closing Time	27	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348875/teyvatdle/character/mondstadt/diona/constellation/cats_tail_closing_time.png
219	Lawrence Pedigree	37	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349046/teyvatdle/character/mondstadt/eula/constellation/lawrence_pedigree.png
151	Chained Reactions	26	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432388/teyvatdle/character/mondstadt/klee/constellation/chained_reactions.png
154	Sparkly Explosion	26	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432488/teyvatdle/character/mondstadt/klee/constellation/sparkly_explosion.png
206	Land Without Promise	35	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433910/teyvatdle/character/mondstadt/rosaria/constellation/land_without_promise.png
210	Divine Retribution	35	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434064/teyvatdle/character/mondstadt/rosaria/constellation/divine_retribution.png
187	Dew-Drinker	32	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435384/teyvatdle/character/liyue/ganyu/constellation/dew-drinker.png
191	The Merciful	32	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435516/teyvatdle/character/liyue/ganyu/constellation/the_merciful.png
201	Lingering Carmine	34	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435689/teyvatdle/character/liyue/hu_tao/constellation/lingering_carmine.png
204	Butterfly's Embrace	34	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517401/teyvatdle/character/liyue/hu_tao/constellation/butterflys_embrace.png
383	Stream of Consciousness	64	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609255/teyvatdle/character/sumeru/layla/constellation/stream_of_consciousness.png
374	The Root of All Fullness	63	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609392/teyvatdle/character/sumeru/nahida/constellation/the_root_of_all_fullness.png
378	The Fruit of Reason's Culmination	63	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609554/teyvatdle/character/sumeru/nahida/constellation/the_fruit_of_reasons_culmination.png
369	Beguiling Shadowstep	62	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609707/teyvatdle/character/sumeru/nilou/constellation/beguiling_shadowstep.png
372	Frostbreaker's Melody	62	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609815/teyvatdle/character/sumeru/nilou/constellation/frostbreakers_melody.png
346	Withering Glimpsed in the Leaves	58	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610017/teyvatdle/character/sumeru/tighnari/constellation/withering_glimpsed_in_the_leaves.png
391	Shoban: Ostentatious Plumage	66	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610171/teyvatdle/character/sumeru/wanderer/constellation/shoban_ostentatious_plumage.png
142	Slowbake	24	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518701/teyvatdle/character/liyue/xiangling/constellation/slowbake.png
322	Bait-and-Switch	54	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520352/teyvatdle/character/liyue/yelan/constellation/bait-and-switch.png
302	Myriad Mise-En-Scène	50	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520525/teyvatdle/character/liyue/yun_jin/constellation/myriad_mise-en-scene.png
306	Decorous Harmony	50	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520681/teyvatdle/character/liyue/yun_jin/constellation/decorous_harmony.png
279	Horns Lowered, Coming Through	47	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521103/teyvatdle/character/inazuma/arataki_itto/constellation/horns_lowered_coming_through.png
282	Arataki Itto, Present!	47	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521229/teyvatdle/character/inazuma/arataki_itto/constellation/arataki_itto_present.png
285	Mauling Hound: Fierce as Fire	48	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521357/teyvatdle/character/inazuma/gorou/constellation/mauling_hound_fierce_as_fire.png
313	Kyouka Fuushi	53	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521989/teyvatdle/character/inazuma/kamisato_ayato/constellation/kyouka_fuushi.png
316	Endless Flow	53	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690522115/teyvatdle/character/inazuma/kamisato_ayato/constellation/endless_flow.png
325	To Cloister Compassion	55	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604469/teyvatdle/character/inazuma/kuki_shinobu/constellation/to_cloister_compassion.png
329	To Cease Courtesies	55	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604618/teyvatdle/character/inazuma/kuki_shinobu/constellation/to_cease_courtesies.png
298	Insight	49	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518412/teyvatdle/character/liyue/shenhe/constellation/insight.png
268	The Moon Overlooks the Waters	45	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605113/teyvatdle/character/inazuma/sangonomiya_kokomi/constellation/the_moon_overlooks_the_waters.png
331	Named Juvenile Casebook	56	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605553/teyvatdle/character/inazuma/shikanoin_heizou/constellation/named_juvenile_casebook.png
334	Tome of Lies	56	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605674/teyvatdle/character/inazuma/shikanoin_heizou/constellation/tome_of_lies.png
272	A Subordinate's Skills	46	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605937/teyvatdle/character/inazuma/thoma/constellation/a_subordinates_skills.png
275	Raging Wildfire	46	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606082/teyvatdle/character/inazuma/thoma/constellation/raging_wildfire.png
309	The Seven Glamours	51	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606281/teyvatdle/character/inazuma/yae_miko/constellation/the_seven_glamours.png
355	Returning Heiress of the Scarlet Sands	60	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607173/teyvatdle/character/sumeru/candace/constellation/returning_heiress_of_the_scarlet_sands.png
358	Sentinel Oath	60	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607323/teyvatdle/character/sumeru/candace/constellation/sentinel_oath.png
338	Through Hill and Copse	57	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607501/teyvatdle/character/sumeru/collei/constellation/through_hill_and_copse.png
341	All Embers	57	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607620/teyvatdle/character/sumeru/collei/constellation/all_embers.png
363	Precept: Lawful Enforcer	61	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607800/teyvatdle/character/sumeru/cyno/constellation/precept_lawful_enforcer.png
366	Raiment: Just Scales	61	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607924/teyvatdle/character/sumeru/cyno/constellation/raiment_just_scales.png
351	Wonders Never Cease	59	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608371/teyvatdle/character/sumeru/dori/constellation/wonders_never_cease.png
385	Truth by Any Means	65	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608524/teyvatdle/character/sumeru/faruzan/constellation/truth_by_any_means.png
388	Divine Comprehension	65	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608637/teyvatdle/character/sumeru/faruzan/constellation/divine_comprehension.png
379	Fortress of Fantasy	64	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609111/teyvatdle/character/sumeru/layla/constellation/fortress_of_fantasy.png
404	Innocent	68	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520015/teyvatdle/character/liyue/yaoyao/constellation/innocent.png
408	Beneficent	68	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520151/teyvatdle/character/liyue/yaoyao/constellation/beneficent.png
435	Universal Recognition	73	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690603997/teyvatdle/character/inazuma/kirara/constellation/universal_recognition.png
397	Intuition	67	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606778/teyvatdle/character/sumeru/alhaitham/constellation/intuition.png
400	Elucidation	67	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607034/teyvatdle/character/sumeru/alhaitham/constellation/elucidation.png
410	The Sand-Blades Glittering	69	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608074/teyvatdle/character/sumeru/dehya/constellation/the_sand-blades_glittering.png
413	The Alpha Unleashed	69	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608208/teyvatdle/character/sumeru/dehya/constellation/the_alpha_unleashed.png
429	Profferings of Dur Untash	72	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608869/teyvatdle/character/sumeru/kaveh/constellation/profferings_of_dur_untash.png
432	Pairidaeza's Dreams	72	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609035/teyvatdle/character/sumeru/kaveh/constellation/pairidaezas_dreams.png
181	Flower of Eden	31	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347212/teyvatdle/character/mondstadt/albedo/constellation/flower_of_eden.png
182	Opening of Phanerozoic	31	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347305/teyvatdle/character/mondstadt/albedo/constellation/opening_of_phanerozoic.png
183	Grace of Helios	31	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347411/teyvatdle/character/mondstadt/albedo/constellation/grace_of_helios.png
184	Descent of Divinity	31	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347443/teyvatdle/character/mondstadt/albedo/constellation/descent_of_divinity.png
186	Dust of Purification	31	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347515/teyvatdle/character/mondstadt/albedo/constellation/dust_of_purification.png
1	One Arrow to Rule Them All	1	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347571/teyvatdle/character/mondstadt/amber/constellation/one_arrow_to_rule_them_all.png
2	Bunny Triggered	1	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347622/teyvatdle/character/mondstadt/amber/constellation/bunny_triggered.png
3	It Burns!	1	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347659/teyvatdle/character/mondstadt/amber/constellation/it_burns.png
5	It's Baron Bunny!	1	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347750/teyvatdle/character/mondstadt/amber/constellation/its_baron_bunny.png
6	Wildfire	1	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347789/teyvatdle/character/mondstadt/amber/constellation/wildfire.png
7	Gleeful Songs	2	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347837/teyvatdle/character/mondstadt/barbara/constellation/gleeful_songs.png
9	Star of Tomorrow	2	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347908/teyvatdle/character/mondstadt/barbara/constellation/star_of_tomorrow.png
10	Attentiveness Be My Power	2	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347950/teyvatdle/character/mondstadt/barbara/constellation/attentiveness_be_my_power.png
11	The Purest Companionship	2	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690347988/teyvatdle/character/mondstadt/barbara/constellation/the_purest_companionship.png
19	Grand Expectation	4	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348072/teyvatdle/character/mondstadt/bennett/constellation/grand_expectation.png
20	Impasse Conqueror	4	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348116/teyvatdle/character/mondstadt/bennett/constellation/impasse_conqueror.png
22	Unexpected Odyssey	4	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348191/teyvatdle/character/mondstadt/bennett/constellation/unexpected_odyssey.png
23	True Explorer	4	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348231/teyvatdle/character/mondstadt/bennett/constellation/true_explorer.png
24	Fire Ventures With Me	4	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348269/teyvatdle/character/mondstadt/bennett/constellation/fire_ventures_with_me.png
32	Searing Ember	6	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348390/teyvatdle/character/mondstadt/diluc/constellation/searing_ember.png
33	Fire and Steel	6	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348430/teyvatdle/character/mondstadt/diluc/constellation/fire_and_steel.png
35	Phoenix, Harbinger of Dawn	6	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348511/teyvatdle/character/mondstadt/diluc/constellation/phoenix_harbinger_of_dawn.png
36	Flaming Sword, Nemesis of the Dark	6	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348564/teyvatdle/character/mondstadt/diluc/constellation/flaming_sword_nemesis_of_the_dark.png
157	A Lingering Flavor	27	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348634/teyvatdle/character/mondstadt/diona/constellation/a_lingering_flavor.png
159	A—Another Round?	27	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348736/teyvatdle/character/mondstadt/diona/constellation/a-another_round.png
418	Sunfrost Encomium	70	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432979/teyvatdle/character/mondstadt/mika/constellation/sunfrost_encomium.png
422	Incisive Discernment	71	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434661/teyvatdle/character/liyue/baizhu/constellation/incisive_discernment.png
425	The Hidden Ebb and Flow	71	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434764/teyvatdle/character/liyue/baizhu/constellation/the_hidden_ebb_and_flow.png
160	Wine Industry Slayer	27	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348785/teyvatdle/character/mondstadt/diona/constellation/wine_industry_slayer.png
161	Double Shot, on the Rocks	27	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348819/teyvatdle/character/mondstadt/diona/constellation/double_shot_on_the_rocks.png
217	Tidal Illusion	37	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690348943/teyvatdle/character/mondstadt/eula/constellation/tidal_illusion.png
218	Lady of Seafoam	37	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349007/teyvatdle/character/mondstadt/eula/constellation/lady_of_seafoam.png
220	The Obstinacy of One's Inferiors	37	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349099/teyvatdle/character/mondstadt/eula/constellation/the_obstinacy_of_ones_inferiors.png
221	Chivalric Quality	37	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349152/teyvatdle/character/mondstadt/eula/constellation/chivalric_quality.png
222	Noble Obligation	37	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349191/teyvatdle/character/mondstadt/eula/constellation/noble_obligation.png
37	Gaze of the Deep	7	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349242/teyvatdle/character/mondstadt/fischl/constellation/gaze_of_the_deep.png
39	Wings of Nightmare	7	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349323/teyvatdle/character/mondstadt/fischl/constellation/wings_of_nightmare.png
40	Her Pilgrimage of Bleak	7	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690349356/teyvatdle/character/mondstadt/fischl/constellation/her_pilgrimage_of_bleak.png
41	Against the Fleeing Light	7	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690431747/teyvatdle/character/mondstadt/fischl/constellation/against_the_fleeing_light.png
43	Spiraling Tempest	8	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690431861/teyvatdle/character/mondstadt/jean/constellation/spiraling_tempest.png
44	People's Aegis	8	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690431901/teyvatdle/character/mondstadt/jean/constellation/peoples_aegis.png
46	Lands of Dandelion	8	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690431978/teyvatdle/character/mondstadt/jean/constellation/lands_of_dandelion.png
47	Outbursting Gust	8	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432016/teyvatdle/character/mondstadt/jean/constellation/outbursting_gust.png
48	Lion's Fang, Fair Protector of Mondstadt	8	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432062/teyvatdle/character/mondstadt/jean/constellation/lions_fang_fair_protector_of_mondstadt.png
50	Never-Ending Performance	9	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432160/teyvatdle/character/mondstadt/kaeya/constellation/never-ending_performance.png
51	Dance of Frost	9	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432203/teyvatdle/character/mondstadt/kaeya/constellation/dance_of_frost.png
53	Frostbiting Embrace	9	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432269/teyvatdle/character/mondstadt/kaeya/constellation/frostbiting_embrace.png
54	Glacial Whirlwind	9	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432307/teyvatdle/character/mondstadt/kaeya/constellation/glacial_whirlwind.png
152	Explosive Frags	26	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432427/teyvatdle/character/mondstadt/klee/constellation/explosive_frags.png
153	Exquisite Compound	26	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432457/teyvatdle/character/mondstadt/klee/constellation/exquisite_compound.png
155	Nova Burst	26	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432526/teyvatdle/character/mondstadt/klee/constellation/nova_burst.png
156	Blazing Delight	26	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432560/teyvatdle/character/mondstadt/klee/constellation/blazing_delight.png
62	Electromagnetic Field	11	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432645/teyvatdle/character/mondstadt/lisa/constellation/electromagnetic_field.png
63	Resonant Thunder	11	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432679/teyvatdle/character/mondstadt/lisa/constellation/resonant_thunder.png
64	Plasma Eruption	11	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432725/teyvatdle/character/mondstadt/lisa/constellation/plasma_eruption.png
66	Pulsating Witch	11	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432807/teyvatdle/character/mondstadt/lisa/constellation/pulsating_witch.png
415	Factor Confluence	70	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432872/teyvatdle/character/mondstadt/mika/constellation/factor_confluence.png
416	Companion's Ingress	70	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432904/teyvatdle/character/mondstadt/mika/constellation/companions_ingress.png
417	Reconnaissance Experience	70	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690432937/teyvatdle/character/mondstadt/mika/constellation/reconnaissance_experience.png
419	Signal Arrow	70	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433012/teyvatdle/character/mondstadt/mika/constellation/signal_arrow.png
420	Companion's Counsel	70	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433055/teyvatdle/character/mondstadt/mika/constellation/companions_counsel.png
67	Prophecy of Submersion	12	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433104/teyvatdle/character/mondstadt/mona/constellation/prophecy_of_submersion.png
69	Restless Revolution	12	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433181/teyvatdle/character/mondstadt/mona/constellation/restless_revolution.png
70	Prophecy of Oblivion	12	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433217/teyvatdle/character/mondstadt/mona/constellation/prophecy_of_oblivion.png
71	Mockery of Fortuna	12	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433258/teyvatdle/character/mondstadt/mona/constellation/mockery_of_fortuna.png
72	Rhetorics of Calamitas	12	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433305/teyvatdle/character/mondstadt/mona/constellation/rhetorics_of_calamitas.png
80	Combat Maid	14	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433420/teyvatdle/character/mondstadt/noelle/constellation/combat_maid.png
82	To Be Cleaned	14	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433496/teyvatdle/character/mondstadt/noelle/constellation/to_be_cleaned.png
83	Favonius Sweeper Master	14	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433532/teyvatdle/character/mondstadt/noelle/constellation/favonius_sweeper_master.png
84	Must Be Spotless	14	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433568/teyvatdle/character/mondstadt/noelle/constellation/must_be_spotless.png
98	Suppression	16	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433679/teyvatdle/character/mondstadt/razor/constellation/suppression.png
99	Soul Companion	16	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433708/teyvatdle/character/mondstadt/razor/constellation/soul_companion.png
101	Sharpened Claws	16	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433779/teyvatdle/character/mondstadt/razor/constellation/sharpened_claws.png
102	Lupus Fulguris	16	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433828/teyvatdle/character/mondstadt/razor/constellation/lupus_fulguris.png
205	Unholy Revelation	35	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433872/teyvatdle/character/mondstadt/rosaria/constellation/unholy_revelation.png
207	The Wages of Sin	35	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433947/teyvatdle/character/mondstadt/rosaria/constellation/the_wages_of_sin.png
208	Painful Grace	35	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690433994/teyvatdle/character/mondstadt/rosaria/constellation/painful_grace.png
209	Last Rites	35	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434032/teyvatdle/character/mondstadt/rosaria/constellation/last_rites.png
103	Clustered Vacuum Field	17	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434113/teyvatdle/character/mondstadt/sucrose/constellation/clustered_vacuum_field.png
105	Flawless Alchemistress	17	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434192/teyvatdle/character/mondstadt/sucrose/constellation/flawless_alchemistress.png
106	Alchemania	17	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434231/teyvatdle/character/mondstadt/sucrose/constellation/alchemania.png
107	Caution: Standard Flask	17	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434264/teyvatdle/character/mondstadt/sucrose/constellation/caution_standard_flask.png
133	Splitting Gales	23	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434369/teyvatdle/character/mondstadt/venti/constellation/splitting_gales.png
134	Breeze of Reminiscence	23	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434405/teyvatdle/character/mondstadt/venti/constellation/breeze_of_reminiscence.png
136	Hurricane of Freedom	23	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434479/teyvatdle/character/mondstadt/venti/constellation/hurricane_of_freedom.png
137	Concerto dal Cielo	23	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434519/teyvatdle/character/mondstadt/venti/constellation/concerto_dal_cielo.png
138	Storm of Defiance	23	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434555/teyvatdle/character/mondstadt/venti/constellation/storm_of_defiance.png
421	Attentive Observation	71	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434629/teyvatdle/character/liyue/baizhu/constellation/attentive_observation.png
423	All Aspects Stabilized	71	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434695/teyvatdle/character/liyue/baizhu/constellation/all_aspects_stabilized.png
424	Ancient Art of Perception	71	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434729/teyvatdle/character/liyue/baizhu/constellation/ancient_art_of_perception.png
426	Elimination of Malicious Qi	71	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434807/teyvatdle/character/liyue/baizhu/constellation/elimination_of_malicious_qi.png
13	Sea Beast's Scourge	3	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434856/teyvatdle/character/liyue/beidou/constellation/sea_beasts_scourge.png
14	Upon the Turbulent Sea, the Thunder Arises	3	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434904/teyvatdle/character/liyue/beidou/constellation/upon_the_turbulent_sea_the_thunder_arises.png
16	Stunning Revenge	3	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690434986/teyvatdle/character/liyue/beidou/constellation/stunning_revenge.png
17	Crimson Tidewalker	3	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435027/teyvatdle/character/liyue/beidou/constellation/crimson_tidewalker.png
25	Ice Unleashed	5	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435107/teyvatdle/character/liyue/chongyun/constellation/ice_unleashed.png
26	Atmospheric Revolution	5	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435148/teyvatdle/character/liyue/chongyun/constellation/atmospheric_revolution.png
28	Frozen Skies	5	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435218/teyvatdle/character/liyue/chongyun/constellation/frozen_skies.png
29	The True Path	5	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435251/teyvatdle/character/liyue/chongyun/constellation/the_true_path.png
30	Rally of Four Blades	5	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435299/teyvatdle/character/liyue/chongyun/constellation/rally_of_four_blades.png
188	The Auspicious	32	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435416/teyvatdle/character/liyue/ganyu/constellation/the_auspicious.png
189	Cloud-Strider	32	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435451/teyvatdle/character/liyue/ganyu/constellation/cloud-strider.png
190	Westward Sojourn	32	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435486/teyvatdle/character/liyue/ganyu/constellation/westward_sojourn.png
192	The Clement	32	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435549/teyvatdle/character/liyue/ganyu/constellation/the_clement.png
199	Crimson Bouquet	34	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435614/teyvatdle/character/liyue/hu_tao/constellation/crimson_bouquet.png
200	Ominous Rainfall	34	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435649/teyvatdle/character/liyue/hu_tao/constellation/ominous_rainfall.png
202	Garden of Eternal Rest	34	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435723/teyvatdle/character/liyue/hu_tao/constellation/garden_of_eternal_rest.png
203	Floral Incense	34	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690435760/teyvatdle/character/liyue/hu_tao/constellation/floral_incense.png
56	Keen Extraction	10	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517500/teyvatdle/character/liyue/keqing/constellation/keen_extraction.png
57	Foreseen Reformation	10	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517534/teyvatdle/character/liyue/keqing/constellation/foreseen_reformation.png
59	Beckoning Stars	10	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517610/teyvatdle/character/liyue/keqing/constellation/beckoning_stars.png
60	Tenacious Star	10	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517654/teyvatdle/character/liyue/keqing/constellation/tenacious_star.png
73	Piercing Fragments	13	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517705/teyvatdle/character/liyue/ningguang/constellation/piercing_fragments.png
75	Majesty Be the Array of Stars	13	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517781/teyvatdle/character/liyue/ningguang/constellation/majesty_be_the_array_of_stars.png
76	Exquisite be the Jade, Outshining All Beneath	13	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517828/teyvatdle/character/liyue/ningguang/constellation/exquisite_be_the_jade_outshining_all_beneath.png
78	Grandeur Be the Seven Stars	13	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517939/teyvatdle/character/liyue/ningguang/constellation/grandeur_be_the_seven_stars.png
91	Ascetics of Frost	15	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690517990/teyvatdle/character/liyue/qiqi/constellation/ascetics_of_frost.png
93	Ascendant Praise	15	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518081/teyvatdle/character/liyue/qiqi/constellation/ascendant_praise.png
94	Divine Suppression	15	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518116/teyvatdle/character/liyue/qiqi/constellation/divine_suppression.png
96	Rite of Resurrection	15	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518194/teyvatdle/character/liyue/qiqi/constellation/rite_of_resurrection.png
295	Clarity of Heart	49	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518276/teyvatdle/character/liyue/shenhe/constellation/clarity_of_heart.png
296	Centered Spirit	49	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518334/teyvatdle/character/liyue/shenhe/constellation/centered_spirit.png
297	Seclusion	49	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518369/teyvatdle/character/liyue/shenhe/constellation/seclusion.png
299	Divine Attainment	49	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518443/teyvatdle/character/liyue/shenhe/constellation/divine_attainment.png
300	Mystical Abandon	49	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518517/teyvatdle/character/liyue/shenhe/constellation/mystical_abandon.png
139	Crispy Outside, Tender Inside	24	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518575/teyvatdle/character/liyue/xiangling/constellation/crispy_outside_tender_inside.png
140	Oil Meets Fire	24	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518618/teyvatdle/character/liyue/xiangling/constellation/oil_meets_fire.png
143	Guoba Mad	24	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518731/teyvatdle/character/liyue/xiangling/constellation/guoba_mad.png
144	Condensed Pyronado	24	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518765/teyvatdle/character/liyue/xiangling/constellation/condensed_pyronado.png
193	Dissolution Eon: Destroyer of Worlds	33	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518818/teyvatdle/character/liyue/xiao/constellation/dissolution_eon_destroyer_of_worlds.png
195	Conqueror of Evil: Wrath Deity	33	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690518901/teyvatdle/character/liyue/xiao/constellation/conqueror_of_evil_wrath_deity.png
196	Transcension: Extinction of Suffering	33	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519093/teyvatdle/character/liyue/xiao/constellation/transcension_extinction_of_suffering.png
198	Conqueror of Evil: Guardian Yaksha	33	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519170/teyvatdle/character/liyue/xiao/constellation/conqueror_of_evil_guardian_yaksha.png
145	The Scent Remained	25	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519223/teyvatdle/character/liyue/xingqiu/constellation/the_scent_remained.png
147	Weaver of Verses	25	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519305/teyvatdle/character/liyue/xingqiu/constellation/weaver_of_verses.png
148	Evilsoother	25	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519344/teyvatdle/character/liyue/xingqiu/constellation/evilsoother.png
149	Embrace of Rain	25	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519386/teyvatdle/character/liyue/xingqiu/constellation/embrace_of_rain.png
169	Fatal Acceleration	29	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519495/teyvatdle/character/liyue/xinyan/constellation/fatal_acceleration.png
170	Impromptu Opening	29	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519527/teyvatdle/character/liyue/xinyan/constellation/impromptu_opening.png
172	Wildfire Rhythm	29	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519625/teyvatdle/character/liyue/xinyan/constellation/wildfire_rhythm.png
173	Screamin' for an Encore	29	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519660/teyvatdle/character/liyue/xinyan/constellation/screamin_for_an_encore.png
174	Rockin' in a Flaming World	29	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519697/teyvatdle/character/liyue/xinyan/constellation/rockin_in_a_flaming_world.png
212	Right of Final Interpretation	36	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519797/teyvatdle/character/liyue/yanfei/constellation/right_of_final_interpretation.png
213	Samadhi Fire-Forged	36	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519833/teyvatdle/character/liyue/yanfei/constellation/samadhi_fire-forged.png
215	Abiding Affidavit	36	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519900/teyvatdle/character/liyue/yanfei/constellation/abiding_affidavit.png
216	Extra Clause	36	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519933/teyvatdle/character/liyue/yanfei/constellation/extra_clause.png
403	Adeptus' Tutelage	68	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690519980/teyvatdle/character/liyue/yaoyao/constellation/adeptus_tutelage.png
405	Loyal and Kind	68	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520042/teyvatdle/character/liyue/yaoyao/constellation/loyal_and_kind.png
406	Winsome	68	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520079/teyvatdle/character/liyue/yaoyao/constellation/winsome.png
407	Compassionate	68	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520116/teyvatdle/character/liyue/yaoyao/constellation/compassionate.png
319	Enter the Plotters	54	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520191/teyvatdle/character/liyue/yelan/constellation/enter_the_plotters.png
320	Taking All Comers	54	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520227/teyvatdle/character/liyue/yelan/constellation/taking_all_comers.png
321	Beware the Trickster's Dice	54	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520262/teyvatdle/character/liyue/yelan/constellation/beware_the_tricksters_dice.png
323	Dealer's Sleight	54	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520405/teyvatdle/character/liyue/yelan/constellation/dealers_sleight.png
324	Winner Takes All	54	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520439/teyvatdle/character/liyue/yelan/constellation/winner_takes_all.png
301	Thespian Gallop	50	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520493/teyvatdle/character/liyue/yun_jin/constellation/thespian_gallop.png
303	Seafaring General	50	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520570/teyvatdle/character/liyue/yun_jin/constellation/seafaring_general.png
304	Flower and a Fighter	50	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520609/teyvatdle/character/liyue/yun_jin/constellation/flower_and_a_fighter.png
305	Famed Throughout the Land	50	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520646/teyvatdle/character/liyue/yun_jin/constellation/famed_throughout_the_land.png
175	Rock, the Backbone of Earth	30	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520729/teyvatdle/character/liyue/zhongli/constellation/rock_the_backbone_of_earth.png
177	Jade, Shimmering through Darkness	30	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520811/teyvatdle/character/liyue/zhongli/constellation/jade_shimmering_through_darkness.png
178	Topaz, Unbreakable and Fearless	30	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520848/teyvatdle/character/liyue/zhongli/constellation/topaz_unbreakable_and_fearless.png
180	Chrysos, Bounty of Dominator	30	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690520935/teyvatdle/character/liyue/zhongli/constellation/chrysos_bounty_of_dominator.png
277	Stay a While and Listen Up	47	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521006/teyvatdle/character/inazuma/arataki_itto/constellation/stay_a_while_and_listen_up.png
278	Gather 'Round, It's a Brawl!	47	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521050/teyvatdle/character/inazuma/arataki_itto/constellation/gather_round_its_a_brawl.png
280	Jailhouse Bread and Butter	47	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521140/teyvatdle/character/inazuma/arataki_itto/constellation/jailhouse_bread_and_butter.png
281	10 Years of Hanamizaka Fame	47	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521185/teyvatdle/character/inazuma/arataki_itto/constellation/10_years_of_hanamizaka_fame.png
283	Rushing Hound: Swift as the Wind	48	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521275/teyvatdle/character/inazuma/gorou/constellation/rushing_hound_swift_as_the_wind.png
284	Sitting Hound: Steady as a Clock	48	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521320/teyvatdle/character/inazuma/gorou/constellation/sitting_hound_steady_as_a_clock.png
286	Lapping Hound: Warm as Water	48	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521399/teyvatdle/character/inazuma/gorou/constellation/lapping_hound_warm_as_water.png
287	Striking Hound: Thunderous Force	48	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521440/teyvatdle/character/inazuma/gorou/constellation/striking_hound_thunderous_force.png
288	Valiant Hound: Mountainous Fealty	48	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521477/teyvatdle/character/inazuma/gorou/constellation/valiant_hound_mountainous_fealty.png
223	Scarlet Hills	38	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521529/teyvatdle/character/inazuma/kaedehara_kazuha/constellation/scarlet_hills.png
225	Maple Monogatari	38	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521600/teyvatdle/character/inazuma/kaedehara_kazuha/constellation/maple_monogatari.png
226	Oozora Genpou	38	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521631/teyvatdle/character/inazuma/kaedehara_kazuha/constellation/oozora_genpou.png
227	Wisdom of Bansei	38	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521669/teyvatdle/character/inazuma/kaedehara_kazuha/constellation/wisdom_of_bansei.png
229	Snowswept Sakura	39	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521750/teyvatdle/character/inazuma/kamisato_ayaka/constellation/snowswept_sakura.png
230	Blizzard Blade Seki no To	39	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521781/teyvatdle/character/inazuma/kamisato_ayaka/constellation/blizzard_blade_seki_no_to.png
231	Frostbloom Kamifubuki	39	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521822/teyvatdle/character/inazuma/kamisato_ayaka/constellation/frostbloom_kamifubuki.png
233	Blossom Cloud Irutsuki	39	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521894/teyvatdle/character/inazuma/kamisato_ayaka/constellation/blossom_cloud_irutsuki.png
234	Dance of Suigetsu	39	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690521941/teyvatdle/character/inazuma/kamisato_ayaka/constellation/dance_of_suigetsu.png
314	World Source	53	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690522052/teyvatdle/character/inazuma/kamisato_ayato/constellation/world_source.png
315	To Admire the Flowers	53	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690522082/teyvatdle/character/inazuma/kamisato_ayato/constellation/to_admire_the_flowers.png
317	Bansui Ichiro	53	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690522147/teyvatdle/character/inazuma/kamisato_ayato/constellation/bansui_ichiro.png
318	Boundless Origin	53	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690603856/teyvatdle/character/inazuma/kamisato_ayato/constellation/boundless_origin.png
433	Material Circulation	73	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690603932/teyvatdle/character/inazuma/kirara/constellation/material_circulation.png
434	Perfectly Packaged	73	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690603966/teyvatdle/character/inazuma/kirara/constellation/perfectly_packaged.png
436	Steed of Skanda	73	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604042/teyvatdle/character/inazuma/kirara/constellation/steed_of_skanda.png
437	A Thousand Miles in a Day	73	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604081/teyvatdle/character/inazuma/kirara/constellation/a_thousand_miles_in_a_day.png
438	Countless Sights to See	73	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604122/teyvatdle/character/inazuma/kirara/constellation/countless_sights_to_see.png
254	Dark Wings	43	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604219/teyvatdle/character/inazuma/kujou_sara/constellation/dark_wings.png
255	The War Within	43	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604280/teyvatdle/character/inazuma/kujou_sara/constellation/the_war_within.png
257	Spellsinger	43	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604362/teyvatdle/character/inazuma/kujou_sara/constellation/spellsinger.png
258	Sin of Pride	43	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604402/teyvatdle/character/inazuma/kujou_sara/constellation/sin_of_pride.png
326	To Forsake Fortune	55	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604504/teyvatdle/character/inazuma/kuki_shinobu/constellation/to_forsake_fortune.png
327	To Sequester Sorrow	55	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604545/teyvatdle/character/inazuma/kuki_shinobu/constellation/to_sequester_sorrow.png
328	To Sever Sealing	55	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604579/teyvatdle/character/inazuma/kuki_shinobu/constellation/to_sever_sealing.png
330	To Ward Weakness	55	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604657/teyvatdle/character/inazuma/kuki_shinobu/constellation/to_ward_weakness.png
259	Ominous Inscription	44	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604723/teyvatdle/character/inazuma/raiden_shogun/constellation/ominous_inscription.png
261	Shinkage Bygones	44	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604795/teyvatdle/character/inazuma/raiden_shogun/constellation/shinkage_bygones.png
262	Pledge of Propriety	44	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604837/teyvatdle/character/inazuma/raiden_shogun/constellation/pledge_of_propriety.png
263	Shogun's Descent	44	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604870/teyvatdle/character/inazuma/raiden_shogun/constellation/shoguns_descent.png
265	At Water's Edge	45	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690604960/teyvatdle/character/inazuma/sangonomiya_kokomi/constellation/at_waters_edge.png
266	The Clouds Like Waves Rippling	45	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605013/teyvatdle/character/inazuma/sangonomiya_kokomi/constellation/the_clouds_like_waves_rippling.png
267	The Moon, A Ship O'er the Seas	45	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605061/teyvatdle/character/inazuma/sangonomiya_kokomi/constellation/the_moon_a_ship_oer_the_seas.png
269	All Streams Flow to the Sea	45	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605157/teyvatdle/character/inazuma/sangonomiya_kokomi/constellation/all_streams_flow_to_the_sea.png
270	Sango Isshin	45	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605197/teyvatdle/character/inazuma/sangonomiya_kokomi/constellation/sango_isshin.png
235	Multi-Task no Jutsu	40	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605237/teyvatdle/character/inazuma/sayu/constellation/multi-task_no_jutsu.png
237	Eh, the Bunshin Can Handle It	40	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605350/teyvatdle/character/inazuma/sayu/constellation/eh_the_bunshin_can_handle_it.png
238	Skiving: New and Improved	40	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605396/teyvatdle/character/inazuma/sayu/constellation/skiving_new_and_improved.png
240	Sleep O'Clock	40	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605493/teyvatdle/character/inazuma/sayu/constellation/sleep_oclock.png
332	Investigative Collection	56	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605592/teyvatdle/character/inazuma/shikanoin_heizou/constellation/investigative_collection.png
333	Esoteric Puzzle Book	56	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605630/teyvatdle/character/inazuma/shikanoin_heizou/constellation/esoteric_puzzle_book.png
335	Secret Archive	56	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605710/teyvatdle/character/inazuma/shikanoin_heizou/constellation/secret_archive.png
336	Curious Casefiles	56	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605758/teyvatdle/character/inazuma/shikanoin_heizou/constellation/curious_casefiles.png
271	A Comrade's Duty	46	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605888/teyvatdle/character/inazuma/thoma/constellation/a_comrades_duty.png
273	Fortified Resolve	46	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690605982/teyvatdle/character/inazuma/thoma/constellation/fortified_resolve.png
274	Long-Term Planning	46	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606021/teyvatdle/character/inazuma/thoma/constellation/long-term_planning.png
276	Burning Heart	46	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606112/teyvatdle/character/inazuma/thoma/constellation/burning_heart.png
307	Yakan Offering	51	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606180/teyvatdle/character/inazuma/yae_miko/constellation/yakan_offering.png
308	Fox's Mooncall	51	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606231/teyvatdle/character/inazuma/yae_miko/constellation/foxs_mooncall.png
310	Sakura Channeling	51	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606362/teyvatdle/character/inazuma/yae_miko/constellation/sakura_channeling.png
311	Mischievous Teasing	51	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606403/teyvatdle/character/inazuma/yae_miko/constellation/mischievous_teasing.png
312	Forbidden Art: Daisesshou	51	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606447/teyvatdle/character/inazuma/yae_miko/constellation/forbidden_art_daisesshou.png
241	Agate Ryuukin	41	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606514/teyvatdle/character/inazuma/yoimiya/constellation/agate_ryuukin.png
242	A Procession of Bonfires	41	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606552/teyvatdle/character/inazuma/yoimiya/constellation/a_procession_of_bonfires.png
244	Pyrotechnic Professional	41	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606633/teyvatdle/character/inazuma/yoimiya/constellation/pyrotechnic_professional.png
245	A Summer Festival's Eve	41	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606671/teyvatdle/character/inazuma/yoimiya/constellation/a_summer_festivals_eve.png
398	Debate	67	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606814/teyvatdle/character/sumeru/alhaitham/constellation/debate.png
399	Negation	67	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690606966/teyvatdle/character/sumeru/alhaitham/constellation/negation.png
401	Sagacity	67	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607069/teyvatdle/character/sumeru/alhaitham/constellation/sagacity.png
402	Structuration	67	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607116/teyvatdle/character/sumeru/alhaitham/constellation/structuration.png
356	Moon-Piercing Brilliance	60	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607232/teyvatdle/character/sumeru/candace/constellation/moon-piercing_brilliance.png
357	Hunter's Supplication	60	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607288/teyvatdle/character/sumeru/candace/constellation/hunters_supplication.png
359	Heterochromatic Gaze	60	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607358/teyvatdle/character/sumeru/candace/constellation/heterochromatic_gaze.png
360	The Overflow	60	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607394/teyvatdle/character/sumeru/candace/constellation/the_overflow.png
337	Deepwood Patrol	57	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607462/teyvatdle/character/sumeru/collei/constellation/deepwood_patrol.png
339	Scent of Summer	57	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607547/teyvatdle/character/sumeru/collei/constellation/scent_of_summer.png
340	Gift of the Woods	57	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607584/teyvatdle/character/sumeru/collei/constellation/gift_of_the_woods.png
342	Forest of Falling Arrows	57	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607651/teyvatdle/character/sumeru/collei/constellation/forest_of_falling_arrows.png
361	Ordinance: Unceasing Vigil	61	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607699/teyvatdle/character/sumeru/cyno/constellation/ordinance_unceasing_vigil.png
362	Ceremony: Homecoming of Spirits	61	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607746/teyvatdle/character/sumeru/cyno/constellation/ceremony_homecoming_of_spirits.png
364	Austerity: Forbidding Guard	61	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607840/teyvatdle/character/sumeru/cyno/constellation/austerity_forbidding_guard.png
365	Funerary Rite: The Passing of Starlight	61	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690607879/teyvatdle/character/sumeru/cyno/constellation/funerary_rite_the_passing_of_starlight.png
409	The Flame Incandescent	69	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608035/teyvatdle/character/sumeru/dehya/constellation/the_flame_incandescent.png
411	A Rage Swift as Fire	69	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608111/teyvatdle/character/sumeru/dehya/constellation/a_rage_swift_as_fire.png
412	An Oath Abiding	69	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608175/teyvatdle/character/sumeru/dehya/constellation/an_oath_abiding.png
414	The Burning Claws Cleaving	69	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608242/teyvatdle/character/sumeru/dehya/constellation/the_burning_claws_cleaving.png
349	Additional Investment	59	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608298/teyvatdle/character/sumeru/dori/constellation/additional_investment.png
350	Special Franchise	59	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608338/teyvatdle/character/sumeru/dori/constellation/special_franchise.png
352	Discretionary Supplement	59	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608406/teyvatdle/character/sumeru/dori/constellation/discretionary_supplement.png
353	Value for Mora	59	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608437/teyvatdle/character/sumeru/dori/constellation/value_for_mora.png
354	Sprinkling Weight	59	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608474/teyvatdle/character/sumeru/dori/constellation/sprinkling_weight.png
386	Overzealous Intellect	65	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608568/teyvatdle/character/sumeru/faruzan/constellation/overzealous_intellect.png
387	Spirit-Orchard Stroll	65	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608603/teyvatdle/character/sumeru/faruzan/constellation/spirit-orchard_stroll.png
389	Wonderland of Rumination	65	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608681/teyvatdle/character/sumeru/faruzan/constellation/wonderland_of_rumination.png
390	The Wondrous Path of Truth	65	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608726/teyvatdle/character/sumeru/faruzan/constellation/the_wondrous_path_of_truth.png
427	Sublime Salutations	72	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608781/teyvatdle/character/sumeru/kaveh/constellation/sublime_salutations.png
428	Grace of Royal Roads	72	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608816/teyvatdle/character/sumeru/kaveh/constellation/grace_of_royal_roads.png
430	Feast of Apadana	72	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690608907/teyvatdle/character/sumeru/kaveh/constellation/feast_of_apadana.png
431	Treasures of Bonkhanak	72	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609000/teyvatdle/character/sumeru/kaveh/constellation/treasures_of_bonkhanak.png
380	Light's Remit	64	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609149/teyvatdle/character/sumeru/layla/constellation/lights_remit.png
381	Secrets of the Night	64	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609182/teyvatdle/character/sumeru/layla/constellation/secrets_of_the_night.png
382	Starry Illumination	64	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609219/teyvatdle/character/sumeru/layla/constellation/starry_illumination.png
384	Radiant Soulfire	64	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609293/teyvatdle/character/sumeru/layla/constellation/radiant_soulfire.png
373	The Seed of Stored Knowledge	63	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609354/teyvatdle/character/sumeru/nahida/constellation/the_seed_of_stored_knowledge.png
375	The Shoot of Conscious Attainment	63	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609427/teyvatdle/character/sumeru/nahida/constellation/the_shoot_of_conscious_attainment.png
376	The Stem of Manifest Inference	63	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609467/teyvatdle/character/sumeru/nahida/constellation/the_stem_of_manifest_inference.png
377	The Leaves of Enlightening Speech	63	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609509/teyvatdle/character/sumeru/nahida/constellation/the_leaves_of_enlightening_speech.png
367	Dance of the Waning Moon	62	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609617/teyvatdle/character/sumeru/nilou/constellation/dance_of_the_waning_moon.png
368	The Starry Skies Their Flowers Rain	62	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609661/teyvatdle/character/sumeru/nilou/constellation/the_starry_skies_their_flowers_rain.png
370	Fricative Pulse	62	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609744/teyvatdle/character/sumeru/nilou/constellation/fricative_pulse.png
371	Twirling Light	62	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609783/teyvatdle/character/sumeru/nilou/constellation/twirling_light.png
343	Beginnings Determined at the Roots	58	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609881/teyvatdle/character/sumeru/tighnari/constellation/beginnings_determined_at_the_roots.png
344	Origins Known From the Stem	58	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609931/teyvatdle/character/sumeru/tighnari/constellation/origins_known_from_the_stem.png
345	Fortunes Read Amongst the Branches	58	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690609978/teyvatdle/character/sumeru/tighnari/constellation/fortunes_read_amongst_the_branches.png
347	Comprehension Amidst the Flowers	58	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610060/teyvatdle/character/sumeru/tighnari/constellation/comprehension_amidst_the_flowers.png
348	Karma Adjudged From the Leaden Fruit	58	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610103/teyvatdle/character/sumeru/tighnari/constellation/karma_adjudged_from_the_leaden_fruit.png
392	Niban: Isle Amidst White Waves	66	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610213/teyvatdle/character/sumeru/wanderer/constellation/niban_isle_amidst_white_waves.png
393	Sanban: Moonflower Kusemai	66	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610264/teyvatdle/character/sumeru/wanderer/constellation/sanban_moonflower_kusemai.png
394	Yonban: Set Adrift into Spring	66	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610307/teyvatdle/character/sumeru/wanderer/constellation/yonban_set_adrift_into_spring.png
395	Matsuban: Ancient Illuminator From Abroad	66	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610358/teyvatdle/character/sumeru/wanderer/constellation/matsuban_ancient_illuminator_from_abroad.png
396	Shugen: The Curtains' Melancholic Sway	66	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610408/teyvatdle/character/sumeru/wanderer/constellation/shugen_the_curtains_melancholic_sway.png
247	Star of Another World	42	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610566/teyvatdle/character/other/aloy/constellation/star_of_another_world.png
248	Star of Another World	42	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610566/teyvatdle/character/other/aloy/constellation/star_of_another_world.png
249	Star of Another World	42	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610566/teyvatdle/character/other/aloy/constellation/star_of_another_world.png
250	Star of Another World	42	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610566/teyvatdle/character/other/aloy/constellation/star_of_another_world.png
251	Star of Another World	42	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610566/teyvatdle/character/other/aloy/constellation/star_of_another_world.png
252	Star of Another World	42	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610566/teyvatdle/character/other/aloy/constellation/star_of_another_world.png
165	Abyssal Mayhem: Vortex of Turmoil	28	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610707/teyvatdle/character/snezhnaya/childe/constellation/abyssal_mayhem_vortex_of_turmoil.png
167	Havoc: Formless Blade	28	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610782/teyvatdle/character/snezhnaya/childe/constellation/havoc_formless_blade.png
168	Havoc: Annihilation	28	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610821/teyvatdle/character/snezhnaya/childe/constellation/havoc_annihilation.png
109	Raging Vortex	19	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610926/teyvatdle/character/other/traveler_anemo/constellation/raging_vortex.png
110	Uprising Whirlwind	19	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690610965/teyvatdle/character/other/traveler_anemo/constellation/uprising_whirlwind.png
112	Cherishing Breezes	19	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611035/teyvatdle/character/other/traveler_anemo/constellation/cherishing_breezes.png
113	Vortex Stellaris	19	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611070/teyvatdle/character/other/traveler_anemo/constellation/vortex_stellaris.png
114	Intertwined Winds	19	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611117/teyvatdle/character/other/traveler_anemo/constellation/intertwined_winds.png
116	Rockcore Meltdown	20	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611225/teyvatdle/character/other/traveler_geo/constellation/rockcore_meltdown.png
117	Will of the Rock	20	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611253/teyvatdle/character/other/traveler_geo/constellation/will_of_the_rock.png
119	Meteorite Impact	20	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611316/teyvatdle/character/other/traveler_geo/constellation/meteorite_impact.png
120	Everlasting Boulder	20	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611348/teyvatdle/character/other/traveler_geo/constellation/everlasting_boulder.png
121	Spring Thunder of Fertility	21	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611403/teyvatdle/character/other/traveler_electro/constellation/spring_thunder_of_fertility.png
123	Distant Crackling	21	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611472/teyvatdle/character/other/traveler_electro/constellation/distant_crackling.png
124	Fickle Cloudstrike	21	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611506/teyvatdle/character/other/traveler_electro/constellation/fickle_cloudstrike.png
125	Clamor in the Wilds	21	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611538/teyvatdle/character/other/traveler_electro/constellation/clamor_in_the_wilds.png
127	Symbiotic Creeper	22	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611624/teyvatdle/character/other/traveler_dendro/constellation/symbiotic_creeper.png
128	Green Resilience	22	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611661/teyvatdle/character/other/traveler_dendro/constellation/green_resilience.png
130	Treacle Grass	22	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611737/teyvatdle/character/other/traveler_dendro/constellation/treacle_grass.png
131	Viridian Transience	22	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611772/teyvatdle/character/other/traveler_dendro/constellation/viridian_transience.png
132	Withering Aggregation	22	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690611801/teyvatdle/character/other/traveler_dendro/constellation/withering_aggregation.png
439	A Cold Blade Like a Shadow	74	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851623/teyvatdle/character/fontaine/lynette/constellation/a_cold_blade_like_a_shadow.png
440	Endless Mysteries	74	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851659/teyvatdle/character/fontaine/lynette/constellation/endless_mysteries.png
441	Cognition-Inverting Gaze	74	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851682/teyvatdle/character/fontaine/lynette/constellation/cognition-inverting_gaze.png
442	Tacit Coordination	74	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851711/teyvatdle/character/fontaine/lynette/constellation/tacit_coordination.png
443	Obscuring Ambiguity	74	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851734/teyvatdle/character/fontaine/lynette/constellation/obscuring_ambiguity.png
444	Watchful Eye	74	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851754/teyvatdle/character/fontaine/lynette/constellation/watchful_eye.png
445	Whimsical Wonders	75	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851975/teyvatdle/character/fontaine/lyney/constellation/whimsical_wonders.png
446	Loquacious Cajoling	75	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852005/teyvatdle/character/fontaine/lyney/constellation/loquacious_cajoling.png
447	Prestidigitation	75	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852028/teyvatdle/character/fontaine/lyney/constellation/prestidigitation.png
448	Well-Versed, Well-Rehearsed	75	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852047/teyvatdle/character/fontaine/lyney/constellation/well-versed_well-rehearsed.png
449	To Pierce Enigmas	75	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852082/teyvatdle/character/fontaine/lyney/constellation/to_pierce_enigmas.png
450	Guarded Smile	75	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852106/teyvatdle/character/fontaine/lyney/constellation/guarded_smile.png
451	Swelling Lake	78	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692853114/teyvatdle/character/other/traveler_hydro/constellation/swelling_lake.png
452	Trickling Purity	78	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692853144/teyvatdle/character/other/traveler_hydro/constellation/trickling_purity.png
453	Turbulent Ripples	78	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692853168/teyvatdle/character/other/traveler_hydro/constellation/turbulent_ripples.png
454	Pouring Descent	78	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692853196/teyvatdle/character/other/traveler_hydro/constellation/pouring_descent.png
455	Churning Whirlpool	78	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692853217/teyvatdle/character/other/traveler_hydro/constellation/churning_whirlpool.png
456	Tides of Justice	78	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692853243/teyvatdle/character/other/traveler_hydro/constellation/tides_of_justice.png
457	Dreams of the Foamy Deep	81	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147153/teyvatdle/character/fontaine/freminet/constellation/dreams_of_the_foamy_deep.png
458	Penguins and the Land of Plenty	81	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147178/teyvatdle/character/fontaine/freminet/constellation/penguin_and_the_land_of_plenty.png
459	Song of the Eddies and Bleached Sands	81	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147207/teyvatdle/character/fontaine/freminet/constellation/song_of_the_eddies_and_bleached_sands.png
460	Dance of the Snowy Moon and Flute	81	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147234/teyvatdle/character/fontaine/freminet/constellation/dance_of_the_snowy_moon_and_flute.png
461	Nights of Hearth and Happiness	81	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147261/teyvatdle/character/fontaine/freminet/constellation/nights_of_hearth_and_happiness.png
462	Moment of Waking and Resolve	81	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147300/teyvatdle/character/fontaine/freminet/constellation/moment_of_waking_and_resolve.png
463	Venerable Institution	82	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743294/teyvatdle/character/fontaine/neuvillette/constellation/venerable_institution.png
464	Juridical Exhortation	82	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743338/teyvatdle/character/fontaine/neuvillette/constellation/juridical_exhortation.png
465	Ancient Postulation	82	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743377/teyvatdle/character/fontaine/neuvillette/constellation/ancient_postulation.png
466	Crown of Commiseration	82	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743412/teyvatdle/character/fontaine/neuvillette/constellation/crown_of_commiseration.png
467	Axiomatic Judgment	82	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743446/teyvatdle/character/fontaine/neuvillette/constellation/axiomatic_judgment.png
468	Wrathful Recompense	82	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743508/teyvatdle/character/fontaine/neuvillette/constellation/wrathful_recompense.png
469	Terror for the Evildoers	83	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863047/teyvatdle/character/fontaine/wriothesley/constellation/terror_for_the_evildoers.png
470	Shackles for the Arrogant	83	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863086/teyvatdle/character/fontaine/wriothesley/constellation/shackles_for_the_arrogant.png
471	Punishment for the Frauds	83	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863137/teyvatdle/character/fontaine/wriothesley/constellation/punishment_for_the_frauds.png
472	Redemption for the Suffering	83	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863176/teyvatdle/character/fontaine/wriothesley/constellation/redemption_for_the_suffering.png
473	Mercy for the Wronged	83	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863210/teyvatdle/character/fontaine/wriothesley/constellation/mercy_for_the_wronged.png
474	Esteem for the Innocent	83	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697863249/teyvatdle/character/fontaine/wriothesley/constellation/esteem_for_the_innocent.png
475	"Love Is a Rebellious Bird That None Can Tame"	84	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499354/teyvatdle/character/fontaine/furina/constellation/love_is_a_rebellious_bird_that_none_can_tame.png
476	"A Woman Adapts Like Duckweed in Water"	84	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499422/teyvatdle/character/fontaine/furina/constellation/a_woman_adapts_like_duckweed_in_water.png
477	"My Secret Is Hidden Within Me, No One Will Know My Name"	84	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499491/teyvatdle/character/fontaine/furina/constellation/my_secret_is_hidden_within_me_no_one_will_know_my_name.png
478	"They Know Not Life, Who Dwelt in the Netherworld Not!"	84	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499576/teyvatdle/character/fontaine/furina/constellation/they_know_not_life_who_dwelt_in_the_netherworld_not.png
479	"His Name I Now Know, It Is...!"	84	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499645/teyvatdle/character/fontaine/furina/constellation/his_name_i_now_know_it_is.png
480	"Hear Me — Let Us Raise the Chalice of Love!"	84	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499702/teyvatdle/character/fontaine/furina/constellation/hear_me-let_us_raise_the_chalice_of_love.png
481	A Need to Verify Facts	85	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499898/teyvatdle/character/fontaine/charlotte/constellation/a_need_to_verify_facts.png
482	A Duty to Pursue Truth	85	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499952/teyvatdle/character/fontaine/charlotte/constellation/a_duty_to_pursue_truth.png
483	An Imperative to Independence	85	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499992/teyvatdle/character/fontaine/charlotte/constellation/an_imperative_to_independence.png
484	A Responsibility to Oversee	85	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701500031/teyvatdle/character/fontaine/charlotte/constellation/a_responsibility_to_oversee.png
485	A Principle of Conscience	85	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701500071/teyvatdle/character/fontaine/charlotte/constellation/a_principle_of_conscience.png
486	A Summation of Interest	85	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701500130/teyvatdle/character/fontaine/charlotte/constellation/a_summation_of_interest.png
487	A Lady's Rules for Keeping a Courteous Distance	86	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214976/teyvatdle/character/fontaine/navia/constellation/a_ladys_rules_for_keeping_a_courteous_distance.png
488	The President's Pursuit of Victory	86	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215048/teyvatdle/character/fontaine/navia/constellation/the_presidents_pursuit_of_victory.png
489	Businesswoman's Broad Vision	86	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215105/teyvatdle/character/fontaine/navia/constellation/businesswomans_broad_vision.png
490	The Oathsworn Never Capitulate	86	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215145/teyvatdle/character/fontaine/navia/constellation/the_oathsworn_never_capitulate.png
491	Negotiator's Resolute Negotiations	86	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215204/teyvatdle/character/fontaine/navia/constellation/negotiators_resolute_negotiations.png
492	The Flexible Finesse of the Spina's President	86	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215321/teyvatdle/character/fontaine/navia/constellation/the_flexible_finesse_of_the_spinas_president.png
493	Stable Front Line's Resolve	87	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215420/teyvatdle/character/fontaine/chevreuse/constellation/stable_front_lines_resolve.png
494	Sniper Induced Explosion	87	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215459/teyvatdle/character/fontaine/chevreuse/constellation/sniper_induced_explosion.png
495	Practiced Field Stripping Technique	87	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215496/teyvatdle/character/fontaine/chevreuse/constellation/practiced_field_stripping_technique.png
496	The Secret to Rapid-Fire Multishots	87	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215539/teyvatdle/character/fontaine/chevreuse/constellation/the_secret_to_rapid-fire_multishots.png
497	Enhanced Incendiary Firepower	87	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215610/teyvatdle/character/fontaine/chevreuse/constellation/enhanced_incendiary_firepower.png
498	In Pursuit of Ending Evil	87	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705215678/teyvatdle/character/fontaine/chevreuse/constellation/in_pursuit_of_ending_evil.png
499	Purifying Wind	88	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634295/teyvatdle/character/liyue/xianyun/constellation/purifying_wind.png
500	Aloof From the World	88	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634327/teyvatdle/character/liyue/xianyun/constellation/aloof_from_the_world.png
501	Creations of Star and Moon	88	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634360/teyvatdle/character/liyue/xianyun/constellation/creations_of_star_and_moon.png
502	Mystery Millet Gourmet	88	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634401/teyvatdle/character/liyue/xianyun/constellation/mystery_millet_gourmet.png
503	Astride Rose-Colored Clouds	88	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634450/teyvatdle/character/liyue/xianyun/constellation/astride_rose-colored_clouds.png
504	They Call Her Cloud Retainer	88	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634494/teyvatdle/character/liyue/xianyun/constellation/they_call_her_cloud_retainer.png
505	Bringer of Blessing	89	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634595/teyvatdle/character/liyue/gaming/constellation/bringer_of_blessing.png
506	Plum Blossoms Underfoot	89	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634631/teyvatdle/character/liyue/gaming/constellation/plum_blossoms_underfoot.png
507	Awakening Spirit	89	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634662/teyvatdle/character/liyue/gaming/constellation/awakening_spirit.png
508	Soar Across Mountains	89	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634696/teyvatdle/character/liyue/gaming/constellation/soar_across_mountains.png
509	Evil-Daunting Roar	89	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634724/teyvatdle/character/liyue/gaming/constellation/evil-daunting_roar.png
510	To Tame All Beasts	89	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634778/teyvatdle/character/liyue/gaming/constellation/to_tame_all_beasts.png
511	Six Paths of Sage Silkcraft	90	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711259035/teyvatdle/character/inazuma/chiori/constellation/six_paths_of_sage_silkcraft.png
512	In Five Colors Dyed	90	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711259092/teyvatdle/character/inazuma/chiori/constellation/in_five_colors_dyed.png
513	Four Brocade Embellishments	90	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711259147/teyvatdle/character/inazuma/chiori/constellation/four_brocade_embellishments.png
514	A Tailor's Three Courtesies	90	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711259208/teyvatdle/character/inazuma/chiori/constellation/a_tailors_three_courtesies.png
515	Two Silken Plumules	90	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711259257/teyvatdle/character/inazuma/chiori/constellation/two_silken_plumules.png
516	Sole Principle Pursuit	90	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711259370/teyvatdle/character/inazuma/chiori/constellation/sole_principle_pursuit.png
\.


--
-- TOC entry 4018 (class 0 OID 28922)
-- Dependencies: 307
-- Data for Name: daily_record; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.daily_record (id, character_id, character_solved, talent_id, talent_solved, constellation_id, constellation_solved, food_id, food_solved, weapon_id, weapon_solved, date) FROM stdin;
2	1	1	1	1	1	1	1	1	1	1	2023-08-01 00:00:00
3	1	1	1	1	1	1	1	1	1	1	2023-08-01 04:27:51.493096
6	2	2	2	2	2	2	58	2	2	2	2023-08-02 00:00:00
7	21	0	104	0	148	0	84	0	63	0	2023-08-02 22:09:08.404
8	19	0	183	0	390	0	135	0	45	0	2023-08-02 22:10:41.567
9	66	0	273	0	179	0	240	0	46	0	2023-08-02 22:11:06.15
10	56	0	296	0	173	0	110	0	162	0	2023-08-02 22:11:33.583
11	68	0	75	0	303	0	165	0	80	0	2023-08-02 22:12:06.484
12	34	0	68	0	410	0	93	0	134	0	2023-08-02 22:13:30.557
13	57	0	274	0	70	0	244	0	126	0	2023-08-02 22:31:41.864
14	69	0	140	0	431	0	56	0	27	0	2023-08-02 22:32:57.852
15	17	0	370	0	308	0	85	0	40	0	2023-08-02 22:33:42.496
16	36	0	64	0	211	0	134	0	150	0	2023-08-02 22:34:57.408
17	23	0	246	0	139	0	157	0	95	0	2023-08-03 21:25:28.418
18	67	0	71	0	436	0	35	0	11	0	2023-08-03 21:39:35.44
19	29	0	244	0	186	0	89	0	57	0	2023-08-03 21:39:51.844
20	47	0	275	0	332	0	76	0	13	0	2023-08-03 21:42:33.5
21	65	0	230	0	148	0	216	0	20	0	2023-08-03 21:45:19.612
22	49	0	326	0	124	0	117	0	139	0	2023-08-03 21:51:37.912
23	45	0	8	0	372	0	43	0	77	0	2023-08-04 20:58:14.448
24	61	0	126	0	33	0	84	0	91	0	2023-08-04 21:34:37.791
42	50	0	294	0	275	0	69	0	60	0	2023-08-09 04:36:41
43	35	0	336	0	94	0	164	0	58	0	2023-08-08 21:37:53
44	31	0	232	0	401	0	271	0	151	0	2023-08-08 21:41:06
45	49	0	408	0	360	0	188	0	6	0	2023-08-09 21:16:35
25	39	0	357	0	178	0	196	0	61	0	2023-08-05 21:02:03
26	1	0	409	0	185	0	36	0	123	0	2023-08-05 23:12:23
28	11	0	50	0	405	0	1	0	97	0	2023-08-06 21:45:21
29	28	0	203	0	234	0	102	0	32	0	2023-08-06 22:02:44
30	25	0	4	0	92	0	112	0	79	0	2023-08-06 22:03:27
31	73	0	214	0	3	0	148	0	83	0	2023-08-06 22:08:53
32	46	0	337	0	284	0	193	0	88	0	2023-08-06 22:09:39
33	8	0	129	0	309	0	226	0	4	0	2023-08-06 22:18:23
34	41	0	382	0	110	0	37	0	109	0	2023-08-06 22:21:31
35	2	0	417	0	336	0	62	0	24	0	2023-08-06 22:22:53
36	20	0	223	0	359	0	38	0	13	0	2023-08-06 22:23:24
37	53	0	143	0	287	0	262	0	85	0	2023-08-06 22:26:24
46	29	0	359	0	254	0	142	0	132	0	2023-08-09 21:17:59
47	14	0	50	0	175	0	103	0	137	0	2023-08-09 21:18:32
48	1	0	420	0	40	0	132	0	111	0	2023-08-09 21:19:00
49	67	0	368	0	426	0	42	0	101	0	2023-08-09 21:19:32
50	54	1	307	0	433	0	66	0	63	0	2023-08-09 21:20:21
51	73	0	286	0	214	0	227	0	115	0	2023-08-17 22:31:01
27	48	8	344	0	170	0	39	0	50	1	2023-08-06 14:43:53
52	68	0	99	0	162	0	243	0	17	0	2023-08-18 00:00:00
53	4	0	113	0	99	0	216	0	55	0	2023-08-18 22:03:52
54	12	0	78	0	390	0	212	0	77	0	2023-08-19 22:31:00
55	57	0	324	0	324	0	143	0	2	0	2023-08-19 22:32:00
56	42	0	80	0	287	0	74	0	34	0	2023-09-10 21:16:10
70	63	1	46	1	409	0	278	0	33	1	2023-09-24 00:00:00
61	67	6	216	1	363	1	194	1	85	1	2023-09-15 23:14:38
57	25	0	322	0	298	4	281	0	116	0	2023-09-11 20:40:42
72	7	0	176	0	49	0	141	0	17	0	2023-09-25 21:47:53
73	8	0	136	0	99	0	260	0	49	0	2023-09-26 21:43:46
74	10	0	165	0	319	0	34	0	151	0	2023-09-27 21:47:25
75	29	0	70	0	261	0	301	0	98	0	2023-09-28 21:48:00
62	9	10	339	4	77	9	217	4	66	5	2023-09-16 21:07:46
76	44	0	93	0	443	0	97	0	45	0	2023-09-29 23:08:03
77	15	0	275	0	212	0	268	0	125	0	2023-09-30 21:26:56
63	48	0	305	0	130	3	70	0	59	0	2023-09-17 20:51:24
64	68	0	147	0	2	0	293	0	177	0	2023-09-18 21:05:26
65	41	0	432	0	340	0	252	0	75	0	2023-09-19 21:07:34
58	22	3	344	2	366	4	287	1	179	2	2023-09-12 21:09:18
66	23	1	89	0	408	0	199	1	135	0	2023-09-20 21:05:03
59	49	3	131	1	63	1	138	0	60	0	2023-09-13 20:58:38
67	30	1	308	0	158	0	186	0	148	0	2023-09-21 21:14:31
38	51	25	384	1	333	1	216	4	87	2	2023-08-08 04:09:56
39	38	0	32	0	9	0	143	0	26	0	2023-08-09 04:08:33
40	40	0	270	0	109	0	80	0	130	0	2023-08-09 04:17:30
41	33	0	161	0	142	0	133	0	35	0	2023-08-08 21:36:19
60	56	38	142	12	421	4	173	0	99	5	2023-09-14 19:21:19
68	32	0	7	1	14	0	165	0	159	0	2023-09-22 22:30:29
78	16	0	4	1	237	0	99	0	78	0	2023-10-01 21:06:44
79	55	0	338	0	345	0	172	0	44	0	2023-10-02 20:58:30
69	43	2	335	1	359	1	87	0	110	0	2023-09-23 20:46:17
71	17	0	50	0	232	0	149	0	107	0	2023-09-24 21:13:14
83	24	0	219	0	104	1	71	0	72	0	2023-10-06 20:51:01
80	64	0	402	0	158	2	162	0	99	0	2023-10-03 20:57:54
86	78	0	411	0	204	1	78	0	150	0	2023-10-09 21:00:54
84	43	0	89	1	326	2	180	0	146	0	2023-10-07 20:59:37
81	74	0	139	0	275	11	161	0	113	0	2023-10-04 20:59:44
82	39	0	66	1	173	0	137	0	110	0	2023-10-05 21:01:25
85	70	0	313	1	412	0	260	0	51	0	2023-10-08 21:11:23
87	8	0	257	0	364	0	282	0	97	0	2023-10-10 21:03:10
88	45	0	123	0	454	0	145	0	55	0	2023-10-11 21:19:36
89	75	0	56	0	342	1	259	0	63	0	2023-10-12 21:00:47
90	81	0	232	0	139	0	106	0	61	0	2023-10-13 20:46:41
91	29	0	387	0	35	0	209	0	13	0	2023-10-14 18:49:03
92	64	0	200	0	377	0	298	0	125	0	2023-10-15 20:59:33
93	73	0	190	0	21	0	283	0	80	0	2023-10-16 20:40:56
94	44	1	103	0	25	0	70	0	31	0	2023-10-17 20:55:28
95	63	0	155	0	458	0	211	0	88	0	2023-10-18 21:20:42
96	5	0	315	0	125	0	234	0	87	0	2023-10-19 20:53:52
97	39	1	282	1	207	0	255	0	110	0	2023-10-20 21:55:44
116	42	0	279	0	438	0	198	0	56	0	2023-11-08 00:00:00
112	32	1	150	0	24	0	137	0	191	0	2023-11-04 00:00:00
176	74	0	156	0	451	0	257	0	159	0	2024-01-07 00:00:00
98	65	1	186	1	440	1	208	1	157	1	2023-10-21 21:26:36
113	51	1	119	1	414	1	272	0	129	0	2023-11-05 00:00:00
177	15	0	353	0	437	0	87	0	71	0	2024-01-08 00:00:00
178	72	0	191	0	116	0	126	0	143	0	2024-01-09 00:00:00
114	48	2	254	0	94	1	114	0	123	1	2023-11-06 00:00:00
99	33	2	279	2	276	0	55	1	179	1	2023-10-22 20:45:25
115	29	1	54	0	261	1	204	0	104	0	2023-11-07 00:00:00
117	78	0	83	0	15	0	250	0	35	0	2023-11-09 00:00:00
100	26	1	10	0	104	1	231	1	34	1	2023-10-23 21:14:37
118	19	0	175	0	389	0	123	0	163	0	2023-11-10 00:00:00
119	65	0	2	0	457	0	133	0	32	0	2023-11-11 00:00:00
101	50	1	295	1	128	0	51	0	37	1	2023-10-24 20:53:36
102	2	0	376	0	411	1	114	0	163	0	2023-10-25 20:54:42
103	82	0	294	0	381	0	38	0	78	0	2023-10-26 20:59:54
104	72	1	164	0	412	0	196	0	58	0	2023-10-27 21:05:25
120	34	0	200	0	224	0	103	0	65	0	2023-11-12 00:00:00
121	57	0	232	0	59	0	109	0	182	0	2023-11-13 00:00:00
122	4	0	377	0	436	0	221	0	113	0	2023-11-14 00:00:00
123	53	0	334	0	370	0	260	0	192	0	2023-11-15 00:00:00
105	78	4	303	0	349	1	149	0	35	0	2023-10-28 21:22:57
124	24	0	185	0	391	0	80	0	159	0	2023-11-16 00:00:00
125	69	0	158	0	156	0	275	0	21	0	2023-11-17 00:00:00
126	46	0	140	0	82	0	314	0	118	0	2023-11-18 00:00:00
127	48	0	13	0	70	0	283	0	33	0	2023-11-19 00:00:00
128	29	0	353	0	80	0	35	0	175	0	2023-11-20 00:00:00
129	49	0	252	0	363	0	256	0	37	0	2023-11-21 00:00:00
130	65	0	25	0	401	0	229	0	183	0	2023-11-22 00:00:00
131	28	0	234	0	313	0	66	0	123	0	2023-11-23 00:00:00
132	37	0	208	0	170	0	164	0	41	0	2023-11-24 00:00:00
133	6	0	265	0	297	0	137	0	55	0	2023-11-25 00:00:00
134	61	0	37	0	167	0	225	0	102	0	2023-11-26 00:00:00
135	32	0	62	0	171	0	112	0	53	0	2023-11-27 00:00:00
136	4	0	233	0	277	0	155	0	73	0	2023-11-28 00:00:00
137	15	0	385	0	247	0	81	0	112	0	2023-11-29 00:00:00
138	48	0	414	0	285	0	166	0	179	0	2023-11-30 00:00:00
179	3	0	452	0	195	0	178	0	18	0	2024-01-11 00:00:00
180	78	0	470	0	73	0	285	0	145	0	2024-01-12 00:00:00
139	50	1	175	2	194	0	117	0	58	0	2023-12-01 00:00:00
140	39	0	425	0	309	0	288	0	27	0	2023-12-02 00:00:00
141	35	0	68	0	217	0	89	0	2	0	2023-12-03 00:00:00
142	58	0	22	0	299	0	306	0	71	0	2023-12-04 00:00:00
143	27	0	446	0	66	0	167	0	42	0	2023-12-05 00:00:00
144	51	0	217	0	16	0	142	0	100	0	2023-12-06 00:00:00
106	3	20	366	0	360	3	136	1	137	1	2023-10-29 21:18:08
145	74	0	313	0	323	0	238	0	131	0	2023-12-07 00:00:00
146	57	0	16	0	229	0	152	0	76	0	2023-12-08 00:00:00
147	53	0	468	0	318	0	212	0	113	0	2023-12-09 00:00:00
148	11	0	158	0	10	0	157	0	14	0	2023-12-10 00:00:00
149	63	0	436	0	363	0	131	0	68	0	2023-12-11 00:00:00
150	43	0	41	0	314	0	222	0	159	0	2023-12-12 00:00:00
107	12	0	242	3	251	4	37	0	141	0	2023-10-30 21:08:36
151	50	0	223	0	414	0	272	0	164	0	2023-12-13 00:00:00
152	15	0	284	0	169	0	93	0	84	0	2023-12-14 00:00:00
153	10	0	325	0	109	0	80	0	13	0	2023-12-15 00:00:00
154	5	0	67	0	73	0	42	0	111	0	2023-12-16 00:00:00
155	70	0	58	0	194	0	39	0	56	0	2023-12-17 00:00:00
108	43	0	459	3	58	3	273	0	47	0	2023-10-31 21:11:30
156	58	0	315	0	57	0	72	0	133	0	2023-12-18 00:00:00
109	25	1	148	0	270	1	109	0	140	0	2023-11-01 20:38:33
110	69	0	62	0	142	0	209	0	81	0	2023-11-02 20:55:05
157	38	0	77	0	439	0	185	0	104	0	2023-12-19 00:00:00
158	68	0	291	0	394	0	61	0	114	0	2023-12-20 00:00:00
111	56	1	250	0	77	2	128	0	142	0	2023-11-03 21:02:25
159	78	1	302	0	142	0	313	0	194	0	2023-12-21 00:00:00
160	27	0	355	0	176	0	97	0	47	0	2023-12-22 00:00:00
161	53	0	239	0	486	0	186	0	80	0	2023-12-23 00:00:00
162	1	0	156	0	275	0	275	0	5	0	2023-12-24 00:00:00
163	82	0	183	0	219	0	203	0	57	0	2023-12-25 00:00:00
164	73	0	267	0	9	0	110	0	149	0	2023-12-26 00:00:00
165	44	0	127	0	95	0	318	0	188	0	2023-12-27 00:00:00
166	48	0	103	0	305	0	141	0	180	0	2023-12-28 00:00:00
167	30	0	146	0	36	0	168	0	37	0	2023-12-29 00:00:00
168	40	0	101	0	329	0	164	0	109	0	2023-12-30 00:00:00
169	5	0	396	0	323	0	146	0	77	0	2023-12-31 00:00:00
170	35	0	446	0	221	0	218	0	58	0	2024-01-01 00:00:00
171	54	0	41	0	178	0	196	0	24	0	2024-01-02 00:00:00
172	75	0	260	0	371	0	75	0	184	0	2024-01-03 00:00:00
173	19	0	369	0	17	0	223	0	97	0	2024-01-04 00:00:00
174	64	0	351	0	482	0	230	0	76	0	2024-01-05 00:00:00
175	68	0	223	0	256	0	73	0	181	0	2024-01-06 00:00:00
181	4	0	340	0	230	0	211	0	103	0	2024-01-13 00:00:00
182	11	0	300	0	367	0	217	0	25	0	2024-01-14 00:00:00
183	46	0	115	0	219	0	167	0	83	0	2024-01-15 00:00:00
184	35	0	366	0	411	0	134	0	48	0	2024-01-16 00:00:00
185	19	0	137	0	378	0	272	0	6	0	2024-01-17 00:00:00
186	9	0	327	0	397	0	232	0	176	0	2024-01-18 00:00:00
187	61	0	172	0	199	0	186	0	61	0	2024-01-19 00:00:00
188	17	0	114	0	250	0	254	0	150	0	2024-01-20 00:00:00
189	45	0	279	0	435	0	93	0	196	0	2024-01-21 00:00:00
190	84	0	125	0	278	0	177	0	144	0	2024-01-22 00:00:00
191	20	0	302	0	265	0	50	0	194	0	2024-01-23 00:00:00
192	38	0	196	0	441	0	259	0	59	0	2024-01-24 00:00:00
193	58	0	318	0	83	0	86	0	190	0	2024-01-25 00:00:00
194	23	0	399	0	43	0	61	0	191	0	2024-01-26 00:00:00
195	2	0	402	0	36	0	258	0	136	0	2024-01-27 00:00:00
196	36	0	22	0	354	0	244	0	38	0	2024-01-28 00:00:00
197	67	0	263	0	141	0	89	0	182	0	2024-01-29 00:00:00
198	72	0	305	0	3	0	70	0	177	0	2024-01-30 00:00:00
199	70	0	454	0	17	0	276	0	116	0	2024-01-31 00:00:00
200	59	0	451	0	51	0	304	0	73	0	2024-02-01 00:00:00
201	4	0	452	0	116	0	217	0	71	0	2024-02-09 18:06:12.363007
202	46	0	21	0	252	0	124	0	160	0	2024-02-10 00:00:00
203	14	0	260	0	63	0	316	0	137	0	2024-02-11 00:00:00
204	65	0	244	0	435	0	259	0	87	0	2024-02-12 00:00:00
205	48	0	88	0	318	0	184	0	129	0	2024-02-13 00:00:00
206	38	0	310	0	438	0	229	0	110	0	2024-02-14 00:00:00
207	55	0	113	0	12	0	317	0	109	0	2024-02-15 00:00:00
208	9	0	441	0	301	0	231	0	84	0	2024-02-16 00:00:00
209	25	0	292	0	307	0	221	0	70	0	2024-02-17 00:00:00
210	61	0	361	0	476	0	341	0	79	0	2024-02-18 00:00:00
211	60	0	94	0	306	0	203	0	177	0	2024-02-19 00:00:00
212	69	0	202	0	440	0	197	0	144	0	2024-02-20 00:00:00
213	40	0	177	0	157	0	208	0	26	0	2024-02-21 00:00:00
214	58	0	130	0	134	0	252	0	42	0	2024-02-22 00:00:00
215	67	0	478	0	367	0	329	0	150	0	2024-02-23 00:00:00
216	71	0	2	0	83	0	183	0	43	0	2024-02-24 00:00:00
217	65	0	453	0	60	0	268	0	180	0	2024-02-25 00:00:00
218	81	0	320	0	210	0	47	0	174	0	2024-02-26 00:00:00
219	54	0	463	0	16	0	297	0	190	0	2024-02-27 00:00:00
220	3	0	11	0	63	0	121	0	95	0	2024-02-28 00:00:00
221	83	0	326	0	365	0	305	0	56	0	2024-02-29 00:00:00
222	5	0	7	0	191	0	223	0	61	0	2024-03-01 00:00:00
257	1	1	39	0	144	0	245	0	22	0	2024-04-05 00:00:00
258	85	0	190	0	366	0	92	0	86	0	2024-04-06 00:00:00
259	47	0	453	0	371	0	80	0	139	0	2024-04-07 00:00:00
260	60	0	21	0	12	0	221	0	121	0	2024-04-08 00:00:00
261	20	0	323	0	57	0	103	0	35	0	2024-04-09 00:00:00
262	40	0	164	0	321	0	334	0	119	0	2024-04-10 00:00:00
263	84	0	137	0	423	0	77	0	78	0	2024-04-11 00:00:00
236	41	11	121	3	344	4	140	7	62	8	2024-03-15 00:00:00
223	60	5	200	3	434	1	217	1	131	1	2024-03-02 00:00:00
224	29	2	390	0	12	0	246	0	89	0	2024-03-03 00:00:00
274	41	1	181	1	397	1	196	0	160	1	2024-04-23 00:00:00
225	49	2	155	0	138	0	296	0	140	0	2024-03-04 00:00:00
226	26	0	481	0	62	0	202	0	97	0	2024-03-05 00:00:00
227	15	0	176	0	360	0	257	0	11	0	2024-03-06 00:00:00
228	70	0	469	0	502	0	238	0	40	0	2024-03-07 00:00:00
229	61	0	193	0	483	0	33	0	21	0	2024-03-08 00:00:00
230	88	0	371	0	391	0	92	0	73	0	2024-03-09 00:00:00
231	59	0	228	0	57	0	226	0	178	0	2024-03-10 00:00:00
232	43	0	116	0	122	0	127	0	100	0	2024-03-11 00:00:00
233	64	0	36	0	212	0	166	0	33	0	2024-03-12 00:00:00
234	34	1	122	0	437	0	160	0	164	0	2024-03-13 00:00:00
275	47	0	411	0	13	0	259	0	119	0	2024-04-24 00:00:00
264	88	1	411	1	22	1	318	0	127	0	2024-04-12 00:00:00
265	75	0	445	0	140	0	104	0	72	0	2024-04-13 00:00:00
266	82	0	19	0	204	0	85	0	46	0	2024-04-14 00:00:00
267	51	0	494	0	508	0	184	0	158	0	2024-04-15 00:00:00
268	39	0	172	0	352	0	291	0	130	0	2024-04-16 00:00:00
235	25	7	100	0	210	0	319	0	112	0	2024-03-14 00:00:00
269	66	0	344	0	414	0	163	0	29	0	2024-04-17 00:00:00
237	38	8	435	1	348	0	169	0	115	0	2024-03-16 00:00:00
238	7	0	114	0	266	0	123	0	196	0	2024-03-17 00:00:00
239	31	0	92	0	463	0	315	0	130	0	2024-03-18 00:00:00
240	73	0	233	0	74	0	330	0	92	0	2024-03-19 00:00:00
241	85	0	413	1	320	0	284	0	44	0	2024-03-20 00:00:00
242	42	1	101	0	404	0	142	0	137	0	2024-03-21 00:00:00
243	62	0	433	0	301	0	206	0	13	0	2024-03-22 00:00:00
244	39	0	311	0	230	0	305	0	113	0	2024-03-23 00:00:00
245	35	0	479	0	252	0	103	0	64	0	2024-03-24 00:00:00
246	70	0	221	0	203	0	158	0	20	0	2024-03-25 00:00:00
247	82	0	334	0	497	0	134	0	17	0	2024-03-26 00:00:00
248	68	0	112	0	364	0	337	0	148	0	2024-03-27 00:00:00
249	71	0	27	0	467	0	293	0	111	0	2024-03-28 00:00:00
250	75	0	165	0	189	0	289	0	2	0	2024-03-29 00:00:00
251	43	1	495	0	129	0	139	0	48	0	2024-03-30 00:00:00
252	9	0	396	0	95	0	49	0	118	0	2024-03-31 00:00:00
253	87	0	136	0	388	0	1	0	38	0	2024-04-01 00:00:00
254	41	0	378	0	352	0	75	0	114	0	2024-04-02 00:00:00
270	10	0	72	0	471	0	283	0	40	0	2024-04-18 00:00:00
255	49	0	427	0	380	0	282	0	42	0	2024-04-03 00:00:00
271	44	0	162	0	434	0	166	0	112	0	2024-04-19 00:00:00
272	21	0	388	0	343	0	264	0	116	0	2024-04-20 00:00:00
273	40	0	91	0	251	0	245	0	81	0	2024-04-21 00:00:00
256	32	1	204	1	257	1	95	0	16	1	2024-04-04 00:00:00
276	14	0	309	0	98	0	162	0	72	0	2024-04-25 00:00:00
277	78	0	220	0	280	0	92	0	99	0	2024-04-26 00:00:10
278	82	0	346	0	351	0	310	0	89	0	2024-04-27 00:00:10
279	45	0	451	0	231	0	311	0	63	0	2024-04-28 00:00:10
280	34	0	250	0	371	0	191	0	5	0	2024-04-29 00:00:10
282	31	0	205	0	36	0	297	0	191	0	2024-05-01 00:00:10
281	53	1	463	1	134	0	156	0	75	0	2024-04-30 00:00:00
\.


--
-- TOC entry 4001 (class 0 OID 28736)
-- Dependencies: 289
-- Data for Name: element; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.element (id, name, associated_region_id) FROM stdin;
1	Anemo	1
2	Geo	2
3	Electro	3
4	Dendro	4
5	Hydro	5
6	Pyro	6
7	Cryo	7
\.


--
-- TOC entry 3990 (class 0 OID 28629)
-- Dependencies: 278
-- Data for Name: enemy_drop; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.enemy_drop (id, name, image_url) FROM stdin;
81	Tainted Hydro Phantasm Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692679285/teyvatdle/enemy_drop/elite/tainted_hydro_phantasm_materials.png
82	Breacher Primus Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692679399/teyvatdle/enemy_drop/elite/breacher_primus_materials.png
83	Fatui Operative Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696739567/teyvatdle/enemy_drop/elite/fatui_operative_materials.png
84	Xuanwen Beast Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707629396/teyvatdle/enemy_drop/elite/xuanwen_beast_materials.png
1	Slime Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689558171/teyvatdle/enemy_drop/common/slime_materials.png
3	Samachurl Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689558589/teyvatdle/enemy_drop/common/samachurl_materials.png
2	Hilichurl Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689556860/teyvatdle/enemy_drop/common/hilichurl_materials.png
4	Hilichurl Shooter Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689559319/teyvatdle/enemy_drop/common/hilichurl_shooter_materials.png
5	Fatui Skirmisher Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689566287/teyvatdle/enemy_drop/common/fatui_skirmisher_materials.png
6	Treasure Hoarder Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689566426/teyvatdle/enemy_drop/common/treasure_hoarder_materials.png
7	Whopperflower Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689566601/teyvatdle/enemy_drop/common/whopperflower_materials.png
8	Nobushi Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689566704/teyvatdle/enemy_drop/common/nobushi_materials.png
9	Specter Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689566820/teyvatdle/enemy_drop/common/specter_materials.png
10	Fungus Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689566972/teyvatdle/enemy_drop/common/fungus_materials.png
11	The Eremites Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689567148/teyvatdle/enemy_drop/common/the_eremites_materials.png
12	Mitachurl Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689567287/teyvatdle/enemy_drop/elite/mitachurl_materials.png
13	Abyss Mage Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689567622/teyvatdle/enemy_drop/elite/abyss_mage_materials.png
14	Humanoid Ruin Machine Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689567787/teyvatdle/enemy_drop/elite/humanoid_ruin_machine_materials.png
15	Fatui Cicin Mage Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689567905/teyvatdle/enemy_drop/elite/fatui_cicin_mage_materials.png
16	Fatui Pyro Agent Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689567995/teyvatdle/enemy_drop/elite/fatui_pyro_agent_materials.png
17	Vishap Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568128/teyvatdle/enemy_drop/elite/vishap_materials.png
18	Ruin Sentinel Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568350/teyvatdle/enemy_drop/elite/ruin_sentinel_materials.png
19	Mirror Maiden Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568444/teyvatdle/enemy_drop/elite/mirror_maiden_materials.png
20	Riftwolf Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568535/teyvatdle/enemy_drop/elite/riftwolf_materials.png
21	The Black Serpents Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568620/teyvatdle/enemy_drop/elite/the_black_serpents_materials.png
22	State-Shifted Fungus Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568702/teyvatdle/enemy_drop/elite/state-shifted_fungus_materials.png
23	Ruin Drake Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568796/teyvatdle/enemy_drop/elite/ruin_drake_materials.png
24	Primal Construct Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568892/teyvatdle/enemy_drop/elite/primal_construct_materials.png
25	Consecrated Beast Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689568975/teyvatdle/enemy_drop/elite/consecrated_beast_materials.png
26	Hilichurl Rogue Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689569209/teyvatdle/enemy_drop/elite/hilichurl_rogue_materials.png
79	Fontemer Aberrant Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692678945/teyvatdle/enemy_drop/common/fontemer_aberrant_materials.png
80	Clockwork Meka Materials	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692679025/teyvatdle/enemy_drop/common/clockwork_meka_materials.png
\.


--
-- TOC entry 3988 (class 0 OID 28618)
-- Dependencies: 276
-- Data for Name: enemy_family; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.enemy_family (id, name, type) FROM stdin;
1	Slimes	Common
2	Hilichurls	Common
3	Samachurls	Common
4	Mitachurls	Elite
5	Lawachurls	Elite
6	Hilichurl Shooters	Common
7	Fatui Skirmishers	Common
8	Fatui Cicin Mages	Elite
9	Fatui Pyro Agent	Elite
10	Treasure Hoarders	Common
11	Whopperflowers	Common
12	Nobushi	Common
13	Kairagi	Common
14	Specters	Common
15	Fungi	Common
16	The Eremites	Common
17	Abyss Mages	Elite
18	Abyss Heralds	Elite
19	Abyss Lectors	Elite
20	Ruin Guard	Elite
21	Ruin Hunter	Elite
22	Ruin Grader	Elite
23	Geovishap Hatchling	Elite
24	Geovishap	Elite
25	Bathysmal Vishaps	Elite
26	Ruin Sentinels	Elite
27	Mirror Maiden	Elite
28	Riftwolves	Elite
29	The Black Serpents	Elite
30	Ruin Drakes	Elite
31	Primal Constructs	Elite
32	Consecrated Beasts	Elite
33	Hilichurl Rogues	Elite
35	Fontemer Aberrants	Common
36	Clockwork Meka	Common
37	Tainted Hydro Phantasms	Elite
38	Breacher Primuses	Elite
39	Fatui Operatives	Elite
40	Xuanwen Beasts	Elite
\.


--
-- TOC entry 3997 (class 0 OID 28680)
-- Dependencies: 285
-- Data for Name: enemy_family_drop_map; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.enemy_family_drop_map (enemy_family_id, enemy_drop_id) FROM stdin;
3	3
6	2
6	4
7	5
8	5
9	5
10	6
11	7
12	8
13	8
14	9
15	10
16	11
4	12
5	12
17	13
18	13
19	13
20	14
21	14
22	14
8	15
9	16
23	17
24	17
25	17
26	18
27	19
28	20
18	21
19	21
29	21
15	22
1	1
2	2
3	2
4	2
5	2
30	23
31	24
32	25
33	26
35	79
36	80
37	81
38	82
39	83
40	84
\.


--
-- TOC entry 4007 (class 0 OID 28772)
-- Dependencies: 295
-- Data for Name: food; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.food (id, name, rarity, type_id, special_dish, purchasable, recipe, event, image_url) FROM stdin;
59	Crab Roe Tofu	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829682/teyvatdle/food/recovery_dishes/crab_roe_tofu.png
74	Fatteh	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829817/teyvatdle/food/recovery_dishes/fatteh.png
104	Konda Cuisine	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829961/teyvatdle/food/recovery_dishes/konda_cuisine.png
121	Mora Meat	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830106/teyvatdle/food/recovery_dishes/mora_meat.png
33	Aaru Mixed Rice	2	1	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830664/teyvatdle/food/adventurers_dishes/aaru_mixed_rice.png
127	Northern Smoked Chicken	2	1	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830785/teyvatdle/food/adventurers_dishes/northern_smoked_chicken.png
115	Minty Meat Rolls	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830936/teyvatdle/food/adventurers_dishes/minty_meat_rolls.png
130	Padisarah Pudding	3	1	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689912647/teyvatdle/food/adventurers_dishes/padisarah_pudding.png
80	Forest Essential Oil	3	6	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743630/teyvatdle/food/essential_oils/forest_essential_oil.png
109	Masala Cheese Balls	2	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741505/teyvatdle/food/atk-boosting_dishes/masala_cheese_balls.png
92	Gushing Essential Oil	3	6	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689740562/teyvatdle/food/essential_oils/gushing_essential_oil.png
36	Adventurer's Breakfast Sandwich	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689740865/teyvatdle/food/atk-boosting_dishes/adventurers_breakfast_sandwich.png
37	Almond Tofu	2	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689740916/teyvatdle/food/atk-boosting_dishes/almond_tofu.png
48	Bountiful Year	4	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689740949/teyvatdle/food/atk-boosting_dishes/bountiful_year.png
49	Butter Chicken	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741003/teyvatdle/food/atk-boosting_dishes/butter_chicken.png
54	Chicken Tofu Pudding	4	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741043/teyvatdle/food/atk-boosting_dishes/chicken_tofu_pudding.png
56	Cold Cut Platter	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741086/teyvatdle/food/atk-boosting_dishes/cold_cut_platter.png
58	Crab Roe Kourayaki	2	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741135/teyvatdle/food/atk-boosting_dishes/crab_roe_kourayaki.png
63	Crocodile Jerky	2	4	f	f	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741181/teyvatdle/food/atk-boosting_dishes/crocodile_jerky.png
70	Dragon Beard Noodles	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741219/teyvatdle/food/atk-boosting_dishes/dragon_beard_noodles.png
99	Jade Parcels	4	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741303/teyvatdle/food/atk-boosting_dishes/jade_parcels.png
1	"Pile 'Em Up"	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689740275/teyvatdle/food/atk-boosting_dishes/pile_em_up.png
40	Baklava	3	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742043/teyvatdle/food/atk-boosting_dishes/baklava.png
95	Imported Poultry	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742248/teyvatdle/food/atk-boosting_dishes/imported_poultry.png
83	Frostshield Potion	3	5	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742662/teyvatdle/food/potions/frostshield_potion.png
50	Butter Crab	4	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742760/teyvatdle/food/def-boosting_dishes/butter_crab.png
84	Fruits of the Festival	3	3	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742936/teyvatdle/food/def-boosting_dishes/fruits_of_the_festival.png
98	Jade Fruit Soup	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743051/teyvatdle/food/def-boosting_dishes/jade_fruit_soup.png
114	Minty Fruit Tea	3	3	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743154/teyvatdle/food/def-boosting_dishes/minty_fruit_tea.png
72	Dustproof Potion	3	5	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743881/teyvatdle/food/potions/dustproof_potion.png
55	Chicken-Mushroom Skewer	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744059/teyvatdle/food/recovery_dishes/chicken-mushroom_skewer.png
90	Grilled Tiger Fish	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744230/teyvatdle/food/recovery_dishes/grilled_tiger_fish.png
105	Lambad Fish Roll	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744313/teyvatdle/food/recovery_dishes/lambad_fish_roll.png
126	Northern Apple Stew	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744461/teyvatdle/food/recovery_dishes/northern_apple_stew.png
69	Desiccant Potion	3	5	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828584/teyvatdle/food/potions/desiccant_potion.png
41	Bamboo Shoot Soup	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828857/teyvatdle/food/recovery_dishes/bamboo_shoot_soup.png
64	Crystal Shrimp	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829055/teyvatdle/food/recovery_dishes/crystal_shrimp.png
79	Flaming Red Bolognese	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829128/teyvatdle/food/recovery_dishes/flaming_red_bolognese.png
124	Mushroom Pizza	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829248/teyvatdle/food/recovery_dishes/mushroom_pizza.png
140	Rose Custard	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829412/teyvatdle/food/recovery_dishes/rose_custard.png
173	Tahchin	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829567/teyvatdle/food/recovery_dishes/tahchin.png
131	Panipuri	2	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830140/teyvatdle/food/recovery_dishes/panipuri.png
157	Sparkling Berry Juice	2	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830250/teyvatdle/food/recovery_dishes/sparkling_berry_juice.png
176	Tea Break Pancake	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830395/teyvatdle/food/recovery_dishes/tea_break_pancake.png
185	Udon Noodles	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830474/teyvatdle/food/recovery_dishes/udon_noodles.png
152	Selva Salad	2	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689912740/teyvatdle/food/adventurers_dishes/selva_salad.png
197	"Sweet Dream"	2	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689912954/teyvatdle/food/atk-boosting_dishes/sweet_dream.png
238	Qingce Household Dish	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913074/teyvatdle/food/atk-boosting_dishes/qingce_household_dish.png
253	The Only Truth	2	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913247/teyvatdle/food/atk-boosting_dishes/the_only_truth.png
231	No Tomorrow	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913418/teyvatdle/food/atk-boosting_dishes/no_tomorrow.png
200	A Prize Catch	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913543/teyvatdle/food/def-boosting_dishes/a_prize_catch.png
219	Forest Watcher's Choice	2	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913653/teyvatdle/food/def-boosting_dishes/forest_watchers_choice.png
226	Heat-Quelling Soup	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913752/teyvatdle/food/def-boosting_dishes/heat-quelling_soup.png
246	Stormcrest Pie	4	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913854/teyvatdle/food/def-boosting_dishes/stormcrest_pie.png
203	All-Weather Beauty	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914058/teyvatdle/food/recovery_dishes/all-weather_beauty.png
215	Extravagant Slumber	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914165/teyvatdle/food/recovery_dishes/extravagant_slumber.png
235	Prosperous Peace	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914274/teyvatdle/food/recovery_dishes/prosperous_peace.png
249	Survival Grilled Fish	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914472/teyvatdle/food/recovery_dishes/survival_grilled_fish.png
211	Dizziness-Be-Gone no Jutsu Version 2.0	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914629/teyvatdle/food/recovery_dishes/dizziness-be-gone_no_jutsu_version20.png
230	Mysterious Bolognese	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914794/teyvatdle/food/recovery_dishes/mysterious_bolognese.png
194	"My Way"	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914913/teyvatdle/food/recovery_dishes/my_way.png
216	Faith Eternal	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915086/teyvatdle/food/recovery_dishes/faith_eternal.png
222	Ghostly March	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915188/teyvatdle/food/recovery_dishes/ghostly_march.png
234	Outrider's Champion Steak!	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915327/teyvatdle/food/recovery_dishes/outriders_champion_steak.png
252	The Endeavor	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915440/teyvatdle/food/recovery_dishes/the_endeavor.png
255	Utmost Care	2	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915663/teyvatdle/food/adventurers_dishes/utmost_care.png
204	Cloud-Shrouded Jade	2	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915741/teyvatdle/food/adventurers_dishes/cloud-shrouded_jade.png
250	Swirling Steps	3	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915863/teyvatdle/food/adventurers_dishes/swirling_steps.png
147	Sashimi Platter	4	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741727/teyvatdle/food/atk-boosting_dishes/sashimi_platter.png
180	Tri-Flavored Skewer	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741962/teyvatdle/food/atk-boosting_dishes/tri-flavored_skewer.png
148	Satisfying Salad	2	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742398/teyvatdle/food/atk-boosting_dishes/satisfying_salad.png
139	Rice Cake Soup	3	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743300/teyvatdle/food/def-boosting_dishes/rice_cake_soup.png
165	Stir-Fried Shrimp	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743418/teyvatdle/food/def-boosting_dishes/stir-fried_shrimp.png
186	Unagi Chazuke	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743538/teyvatdle/food/def-boosting_dishes/unagi_chazuke.png
188	Unmoving Essential Oil	3	6	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743836/teyvatdle/food/essential_oils/unmoving_essential_oil.png
138	Rice Buns	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744538/teyvatdle/food/recovery_dishes/rice_buns.png
151	Scorched Starshroom	1	2	f	f	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828023/teyvatdle/food/recovery_dishes/scorched_starshroom.png
168	Sunsettia	1	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828202/teyvatdle/food/recovery_dishes/sunsettia.png
181	Tricolor Dango	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828318/teyvatdle/food/recovery_dishes/tricolor_dango.png
167	Streaming Essential Oil	3	6	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828478/teyvatdle/food/essential_oils/streaming_essential_oil.png
191	Windbarrier Potion	3	5	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689740740/teyvatdle/food/potions/windbarrier_potion.png
81	Fried Radish Balls	2	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741261/teyvatdle/food/atk-boosting_dishes/fried_radish_balls.png
102	Jueyun Guoba	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741341/teyvatdle/food/atk-boosting_dishes/jueyun_guoba.png
112	Mint Salad	2	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741548/teyvatdle/food/atk-boosting_dishes/mint_salad.png
122	More-and-More	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741624/teyvatdle/food/atk-boosting_dishes/more-and-more.png
135	Qingce Stir Fry	3	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741678/teyvatdle/food/atk-boosting_dishes/qingce_stir_fry.png
149	Sautéed Matsutake	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741774/teyvatdle/food/atk-boosting_dishes/sauteed_matsutake.png
154	Shawarma Wrap	2	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741883/teyvatdle/food/atk-boosting_dishes/shawarma_wrap.png
175	Tandoori Roast Chicken	4	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741919/teyvatdle/food/atk-boosting_dishes/tandoori_roast_chicken.png
192	Wolfhook Juice	2	4	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741998/teyvatdle/food/atk-boosting_dishes/wolfhook_juice.png
43	Berry & Mint Burst	2	4	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742094/teyvatdle/food/atk-boosting_dishes/berry_mint_burst.png
57	Come and Get It	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742146/teyvatdle/food/atk-boosting_dishes/come_and_get_It.png
65	Cured Pork Dry Hotpot	3	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742212/teyvatdle/food/atk-boosting_dishes/cured_pork_dry_hotpot.png
101	Jueyun Chili Chicken	2	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742301/teyvatdle/food/atk-boosting_dishes/jueyun_chili_chicken.png
137	Radish and Fish Stew	2	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742357/teyvatdle/food/atk-boosting_dishes/radish_and_fish_stew.png
166	Stone Harbor Delicacies	2	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742438/teyvatdle/food/atk-boosting_dishes/stone_harbor_delicacies.png
170	Super Magnificent Pizza	4	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742483/teyvatdle/food/atk-boosting_dishes/super_magnificent_pizza.png
178	Tianshu Meat	4	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742530/teyvatdle/food/atk-boosting_dishes/tianshu_meat.png
82	Frosting Essential Oil	3	6	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742622/teyvatdle/food/essential_oils/frosting_essential_oil.png
46	Biryani	4	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742710/teyvatdle/food/def-boosting_dishes/biryani.png
51	Calla Lily Seafood Soup	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742797/teyvatdle/food/def-boosting_dishes/calla_lily_seafood_soup.png
52	Candied Ajilenakh Nut	3	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742840/teyvatdle/food/def-boosting_dishes/candied_ajilenakh_nut.png
76	Fisherman's Toast	2	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742898/teyvatdle/food/def-boosting_dishes/fishermans_toast.png
86	Gilded Tajine	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689742977/teyvatdle/food/def-boosting_dishes/gilded_tajine.png
87	Golden Crab	4	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743019/teyvatdle/food/def-boosting_dishes/golden_crab.png
100	Jewelry Soup	2	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743084/teyvatdle/food/def-boosting_dishes/jewelry_soup.png
106	Lotus Flower Crisp	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743120/teyvatdle/food/def-boosting_dishes/lotus_flower_crisp.png
120	Moon Pie	4	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743198/teyvatdle/food/def-boosting_dishes/moon_pie.png
123	Mushroom Hodgepodge	2	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743234/teyvatdle/food/def-boosting_dishes/mushroom_hodgepodge.png
143	Sakura Shrimp Crackers	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743338/teyvatdle/food/def-boosting_dishes/sakura_shrimp_crackers.png
144	Sakura Tempura	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743379/teyvatdle/food/def-boosting_dishes/sakura_tempura.png
169	Sunshine Sprat	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743454/teyvatdle/food/def-boosting_dishes/sunshine_sprat.png
260	Yearning	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914556/teyvatdle/food/recovery_dishes/yearning.png
258	Way of the Strong	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915528/teyvatdle/food/recovery_dishes/way_of_the_strong.png
268	Lantern Rite Special Fried Radish Balls	2	4	f	f	f	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916039/teyvatdle/food/atk-boosting_dishes/lantern_rite_special_fried_radish_balls.png
267	Lantern Rite Special Come and Get It	3	4	f	f	f	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916239/teyvatdle/food/atk-boosting_dishes/lantern_rite_special_come_and_get_it.png
265	Golden Chicken Burger	3	2	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916516/teyvatdle/food/def-boosting_dishes/golden_chicken_burger.png
275	Milky Mushroom Crisp Tower	3	2	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916608/teyvatdle/food/def-boosting_dishes/milky_mushroom_crisp_tower.png
278	Rice Pudding	3	1	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916757/teyvatdle/food/def-boosting_dishes/rice_pudding.png
277	Rainbow Aster	3	1	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916849/teyvatdle/food/def-boosting_dishes/rainbow_aster.png
182	Triple-Layered Consommé	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743492/teyvatdle/food/def-boosting_dishes/triple-layered_consomme.png
190	Wakatakeni	2	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743577/teyvatdle/food/def-boosting_dishes/wakatakeni.png
68	Dendrocide Potion	3	5	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743677/teyvatdle/food/potions/dendrocide_potion.png
155	Shocking Essential Oil	3	6	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743729/teyvatdle/food/essential_oils/shocking_essential_oil.png
96	Insulation Potion	3	5	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743778/teyvatdle/food/potions/insulation_potion.png
34	Activated Starshroom	1	2	f	f	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743926/teyvatdle/food/recovery_dishes/activated_starshroom.png
39	Apple	1	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689743982/teyvatdle/food/recovery_dishes/apple.png
45	Bird Egg Sushi	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744013/teyvatdle/food/recovery_dishes/bird_egg_sushi.png
66	Curry Shrimp	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744100/teyvatdle/food/recovery_dishes/curry_shrimp.png
71	Dry-Braised Salted Fish	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744135/teyvatdle/food/recovery_dishes/dry-braised_salted_fish.png
75	Fish With Cream Sauce	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744178/teyvatdle/food/recovery_dishes/fish_with_cream_sauce.png
91	Grilled Unagi Fillet	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744273/teyvatdle/food/recovery_dishes/grilled_unagi_fillet.png
110	Matsutake Meat Rolls	2	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744357/teyvatdle/food/recovery_dishes/matsutake_meat_rolls.png
111	Mint Jelly	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744393/teyvatdle/food/recovery_dishes/mint_jelly.png
119	Mondstadt Hash Brown	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744426/teyvatdle/food/recovery_dishes/mondstadt_hash_brown.png
132	Pita Pocket	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689744498/teyvatdle/food/recovery_dishes/pita_pocket.png
141	Sabz Meat Stew	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689827883/teyvatdle/food/recovery_dishes/sabz_meat_stew.png
145	Samosa	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689827945/teyvatdle/food/recovery_dishes/samosa.png
150	Scented Meat Balls	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689827982/teyvatdle/food/recovery_dishes/scented_meat_balls.png
159	Squirrel Fish	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828087/teyvatdle/food/recovery_dishes/squirrel_fish.png
160	Starshroom	1	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828129/teyvatdle/food/recovery_dishes/starshroom.png
171	Sweet Madame	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828246/teyvatdle/food/recovery_dishes/sweet_madame.png
179	Tonkotsu Ramen	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828284/teyvatdle/food/recovery_dishes/tonkotsu_ramen.png
184	Tuna Sushi	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828366/teyvatdle/food/recovery_dishes/tuna_sushi.png
187	Universal Peace	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828413/teyvatdle/food/recovery_dishes/universal_peace.png
78	Flaming Essential Oil	3	6	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828535/teyvatdle/food/essential_oils/flaming_essential_oil.png
93	Heatshield Potion	3	5	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828682/teyvatdle/food/potions/heatshield_potion.png
38	Apple Cider	2	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828775/teyvatdle/food/recovery_dishes/apple_cider.png
44	Berry Mizu Manjuu	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828902/teyvatdle/food/recovery_dishes/berry_mizu_manjuu.png
47	Black-Back Perch Stew	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689828950/teyvatdle/food/recovery_dishes/black-back_perch_stew.png
62	Crispy Potato Shrimp Platter	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829015/teyvatdle/food/recovery_dishes/crispy_potato_shrimp_platter.png
67	Dango Milk	2	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829085/teyvatdle/food/recovery_dishes/dango_milk.png
97	Invigorating Kitty Meal	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829177/teyvatdle/food/recovery_dishes/invigorating_kitty_meal.png
116	Miso Soup	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829213/teyvatdle/food/recovery_dishes/miso_soup.png
129	Onigiri	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829290/teyvatdle/food/recovery_dishes/onigiri.png
133	Pop's Teas	1	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829340/teyvatdle/food/recovery_dishes/pops_teas.png
136	Radish Veggie Soup	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829376/teyvatdle/food/recovery_dishes/radish_veggie_soup.png
156	Soba Noodles	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829445/teyvatdle/food/recovery_dishes/soba_noodles.png
158	Special Mushroom Pizza	3	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829481/teyvatdle/food/recovery_dishes/special_mushroom_pizza.png
164	Stir-Fried Fish Noodles	2	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829531/teyvatdle/food/recovery_dishes/stir-fried_fish_noodles.png
174	Taiyaki	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829602/teyvatdle/food/recovery_dishes/taiyaki.png
53	Charcoal-Baked Ajilenakh Cake	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829636/teyvatdle/food/recovery_dishes/charcoal-baked_ajilenakh_cake.png
60	Crab, Ham & Veggie Bake	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829718/teyvatdle/food/recovery_dishes/crab_ham_veggie_bake.png
73	Egg Roll	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829783/teyvatdle/food/recovery_dishes/egg_roll.png
85	Fullmoon Egg	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829892/teyvatdle/food/recovery_dishes/fullmoon_egg.png
88	Golden Shrimp Balls	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829928/teyvatdle/food/recovery_dishes/golden_shrimp_balls.png
113	Minty Bean Soup	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689829994/teyvatdle/food/recovery_dishes/minty_bean_soup.png
117	Mixed Yakisoba	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830034/teyvatdle/food/recovery_dishes/mixed_yakisoba.png
118	Mondstadt Grilled Fish	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830074/teyvatdle/food/recovery_dishes/mondstadt_grilled_fish.png
134	Potato Boat	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830171/teyvatdle/food/recovery_dishes/potato_boat.png
142	Sakura Mochi	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830206/teyvatdle/food/recovery_dishes/sakura_mochi.png
161	Steak	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830286/teyvatdle/food/recovery_dishes/steak.png
163	Stir-Fried Filet	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830319/teyvatdle/food/recovery_dishes/stir-fried_filet.png
172	Sweet Shrimp Sushi	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830356/teyvatdle/food/recovery_dishes/sweet_shrimp_sushi.png
177	Teyvat Fried Egg	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830436/teyvatdle/food/recovery_dishes/teyvat_fried_egg.png
189	Vegetarian Abalone	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830519/teyvatdle/food/recovery_dishes/vegetarian_abalone.png
89	Goulash	2	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830612/teyvatdle/food/adventurers_dishes/goulash.png
77	Five Pickled Treasures	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830701/teyvatdle/food/adventurers_dishes/five_pickled_treasures.png
125	Noodles with Mountain Delicacies	2	1	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830741/teyvatdle/food/adventurers_dishes/noodles_with_mountain_delicacies.png
42	Barbatos Ratatouille	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830820/teyvatdle/food/adventurers_dishes/barbatos_ratatouille.png
61	Cream Stew	2	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830853/teyvatdle/food/adventurers_dishes/cream_stew.png
107	Lotus Seed and Bird Egg Soup	2	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830885/teyvatdle/food/adventurers_dishes/lotus_seed_and_bird_egg_soup.png
128	Omelette Rice	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689830976/teyvatdle/food/adventurers_dishes/omelette_rice.png
146	Sangayaki	2	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689912704/teyvatdle/food/adventurers_dishes/sangayaki.png
162	Sticky Honey Roast	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689912772/teyvatdle/food/adventurers_dishes/sticky_honey_roast.png
183	Tulumba	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689912815/teyvatdle/food/adventurers_dishes/tulumba.png
193	Zhongyuan Chop Suey	3	1	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689912847/teyvatdle/food/adventurers_dishes/zhongyuan_chop_suey.png
209	Die Heilige Sinfonie	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689912988/teyvatdle/food/atk-boosting_dishes/die_heilige_sinfonie.png
225	Heartstring Noodles	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913031/teyvatdle/food/atk-boosting_dishes/heartstring_noodles.png
243	Show Me the Mora	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913111/teyvatdle/food/atk-boosting_dishes/show_me_the_mora.png
248	Surveyor's Breakfast Sandwich	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913150/teyvatdle/food/atk-boosting_dishes/surveyors_breakfast_sandwich.png
195	"Once Upon a Time in Mondstadt"	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913282/teyvatdle/food/atk-boosting_dishes/once_upon_a_time_in_mondstadt.png
207	Der Weisheit Letzter Schluss (Life)	2	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913330/teyvatdle/food/atk-boosting_dishes/der_weisheit_letzter_schluss_life.png
240	Rockin' Riffin' Chicken!	2	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913475/teyvatdle/food/atk-boosting_dishes/rockin_riffin_chicken.png
208	Dew-Dipped Shrimp	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913581/teyvatdle/food/def-boosting_dishes/dew-dipped_shrimp.png
217	Fish-Flavored Toast	2	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913619/teyvatdle/food/def-boosting_dishes/fish-flavored_toast.png
223	Goldflame Tajine	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913691/teyvatdle/food/def-boosting_dishes/goldflame_tajine.png
224	Halvamazd	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913721/teyvatdle/food/def-boosting_dishes/halvamazd.png
239	Quiet Elegance	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913788/teyvatdle/food/def-boosting_dishes/quiet_elegance.png
242	Shimi Chazuke	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913824/teyvatdle/food/def-boosting_dishes/shimi_chazuke.png
259	Woodland Dream	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913889/teyvatdle/food/def-boosting_dishes/woodland_dream.png
198	"Warmth"	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689913956/teyvatdle/food/recovery_dishes/warmth.png
201	A Stunning Stratagem	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914015/teyvatdle/food/recovery_dishes/a_stunning_stratagem.png
210	Dinner of Judgment	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914092/teyvatdle/food/recovery_dishes/dinner_of_judgment.png
212	Duel Soul	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914132/teyvatdle/food/recovery_dishes/duel_soul.png
220	Fruity Skewers	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914201/teyvatdle/food/recovery_dishes/fruity_skewers.png
227	Ideal Circumstance	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914236/teyvatdle/food/recovery_dishes/ideal_circumstance.png
236	Puppy-Paw Hash Brown	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914347/teyvatdle/food/recovery_dishes/puppy-paw_hash_brown.png
241	Satiety Gel	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914385/teyvatdle/food/recovery_dishes/satiety_gel.png
247	Summer Festival Fish	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914429/teyvatdle/food/recovery_dishes/summer_festival_fish.png
256	Victorious Legend	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914508/teyvatdle/food/recovery_dishes/victorious_legend.png
202	All-Delicacy Parcels	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914596/teyvatdle/food/recovery_dishes/all-delicacy_parcels.png
213	Energizing Bento	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914682/teyvatdle/food/recovery_dishes/energizing_bento.png
228	Invigorating Pizza	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914762/teyvatdle/food/recovery_dishes/invigorating_pizza.png
244	Slow-Cooked Bamboo Shoot Soup	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914827/teyvatdle/food/recovery_dishes/slow-cooked_bamboo_shoot_soup.png
257	Wanmin Restaurant's Boiled Fish	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914869/teyvatdle/food/recovery_dishes/wanmin_restaurants_boiled_fish.png
196	"Snow on the Hearth"	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689914979/teyvatdle/food/recovery_dishes/snow_on_the_hearth.png
206	Definitely Not Bar Food!	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915029/teyvatdle/food/recovery_dishes/definitely_not_bar_food.png
218	Flash-Fried Filet	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915120/teyvatdle/food/recovery_dishes/flash-fried_filet.png
221	Fukuuchi Udon	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915150/teyvatdle/food/recovery_dishes/fukuuchi_udon.png
229	Lighter-Than-Air Pancake	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915221/teyvatdle/food/recovery_dishes/lighter-than-air_pancake.png
232	Nutritious Meal (V.593)	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915259/teyvatdle/food/recovery_dishes/nutritious_meal_v593.png
237	Qiankun Mora Meat	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915364/teyvatdle/food/recovery_dishes/qiankun_mora_meat.png
251	Teyvat Charred Egg	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915398/teyvatdle/food/recovery_dishes/teyvat_charred_egg.png
254	Traditionally-Made Charcoal-Baked Ajilenakh Cake	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915476/teyvatdle/food/recovery_dishes/traditionally-made_charcoal-baked_ajilenakh_cake.png
205	Cold Noodles with Mountain Delicacies	2	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915623/teyvatdle/food/adventurers_dishes/cold_noodles_with_mountain_delicacies.png
199	A Buoyant Breeze	3	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915704/teyvatdle/food/adventurers_dishes/a_buoyant_breeze.png
233	Omurice Waltz	3	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915798/teyvatdle/food/adventurers_dishes/omurice_waltz.png
245	Spicy Stew	2	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915830/teyvatdle/food/adventurers_dishes/spicy_stew.png
262	Braised Meat	3	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915925/teyvatdle/food/atk-boosting_dishes/braised_meat.png
264	Fragrant Mashed Potatoes	3	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689915966/teyvatdle/food/atk-boosting_dishes/fragrant_mashed_potatoes.png
266	Golden Fried Chicken	4	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916001/teyvatdle/food/atk-boosting_dishes/golden_fried_chicken.png
274	Meat Lovers' Mushroom Pizza	4	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916087/teyvatdle/food/atk-boosting_dishes/meat_lovers_mushroom_pizza.png
280	Sunset Berry Tea	3	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916201/teyvatdle/food/atk-boosting_dishes/sunset_berry_tea.png
263	Chili-Mince Cornbread Buns	4	3	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916307/teyvatdle/food/def-boosting_dishes/chili-mince_cornbread_buns.png
270	Lantern Rite Special Jewelry Soup	2	3	f	f	f	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916348/teyvatdle/food/def-boosting_dishes/lantern_rite_special_jewelry_soup.png
273	Lantern Rite Special Triple-Layered Consommé	3	3	f	f	f	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916393/teyvatdle/food/def-boosting_dishes/lantern_rite_special_triple-layered_consomme.png
269	Lantern Rite Special Grilled Tiger Fish	1	2	f	f	f	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916559/teyvatdle/food/def-boosting_dishes/lantern_rite_special_grilled_tiger_fish.png
276	Oncidium Tofu	3	1	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916665/teyvatdle/food/def-boosting_dishes/oncidium_tofu.png
272	Lantern Rite Special Noodles with Mountain Delicacies	2	1	f	f	f	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916714/teyvatdle/food/def-boosting_dishes/lantern_rite_special_noodles_with_mountain_delicacies.png
271	Lantern Rite Special Lotus Seed and Bird Egg Soup	2	1	f	f	f	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916791/teyvatdle/food/def-boosting_dishes/lantern_rite_special_lotus_seed_and_bird_egg_soup.png
94	Holy Water	3	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689916988/teyvatdle/food/recovery_dishes/holy_water.png
103	Katsu Sandwich	2	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689741465/teyvatdle/food/atk-boosting_dishes/katsu_sandwich.png
281	A Leisurely Sip	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692680448/teyvatdle/food/def-boosting_dishes/a_leisurely_sip.png
282	Conch Madeleine	3	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692680474/teyvatdle/food/def-boosting_dishes/conch_madeleine.png
283	Cream of Mushroom Soup	2	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692680653/teyvatdle/food/recovery_dishes/cream_of_mushroom_soup.png
284	Cubic Tricks	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692680797/teyvatdle/food/atk-boosting_dishes/cubic_tricks.png
285	Duck Confit	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692680863/teyvatdle/food/recovery_dishes/duck_confit.png
286	Fish and Chips	3	1	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692680907/teyvatdle/food/adventurers_dishes/fish_and_chips.png
287	Fontaine Aspic	2	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692680949/teyvatdle/food/atk-boosting_dishes/fontaine_aspic.png
288	Fontainian Foie Gras	3	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692680992/teyvatdle/food/def-boosting_dishes/fontainian_foie_gras.png
289	Fontainian Onion Soup	2	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681059/teyvatdle/food/def-boosting_dishes/fontainian_onion_soup.png
290	Fruity Duet	3	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681090/teyvatdle/food/atk-boosting_dishes/fruity_duet.png
291	Fruity Smoothie	3	2	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681145/teyvatdle/food/recovery_dishes/fruity_smoothie.png
292	Fruity Trio	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681222/teyvatdle/food/adventurers_dishes/fruity_trio.png
293	Garlic Baguette	2	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681282/teyvatdle/food/atk-boosting_dishes/garlic_baguette.png
294	Ile flottante	2	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681338/teyvatdle/food/recovery_dishes/ile_flottante.png
295	Lasagna	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681377/teyvatdle/food/recovery_dishes/lasagna.png
296	Pate de Fruit	3	4	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681412/teyvatdle/food/atk-boosting_dishes/pate_de_fruit.png
297	Poisson Seafood Soup	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681452/teyvatdle/food/recovery_dishes/poisson_seafood_soup.png
298	Poissonchant Pie	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681518/teyvatdle/food/recovery_dishes/poissonchant_pie.png
299	Steak Tartare	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681556/teyvatdle/food/recovery_dishes/steak_tartare.png
300	Tasses Ragout	2	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681622/teyvatdle/food/recovery_dishes/tasses_ragout.png
301	Vessie Chicken	4	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681672/teyvatdle/food/atk-boosting_dishes/vessie_chicken.png
302	Bulle Fruit	1	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681701/teyvatdle/food/recovery_dishes/bulle_fruit.png
303	Fonta	2	2	f	t	f	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692681810/teyvatdle/food/recovery_dishes/fonta.png
35	Adeptus' Temptation	5	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689740819/teyvatdle/food/atk-boosting_dishes/adeptus_temptation.png
304	"Seabird's Sojourn"	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147410/teyvatdle/food/recovery_dishes/seabirds_sojourn.png
305	"Consomme Purete"	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696740782/teyvatdle/food/atk-boosting_dishes/consomme_purete.png
306	Barbeque Ribs	2	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696740880/teyvatdle/food/recovery_dishes/barbeque_ribs.png
307	Boudin Noir aux Pommes	2	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741031/teyvatdle/food/adventurers_dishes/boudin_noir_aux_pommes.png
308	Cassoulet	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741128/teyvatdle/food/def-boosting_dishes/cassoulet.png
309	Coffee Bavarois	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741198/teyvatdle/food/recovery_dishes/coffee_bavarois.png
310	Consomme	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741278/teyvatdle/food/atk-boosting_dishes/consomme.png
311	Crepes Suzette	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741360/teyvatdle/food/adventurers_dishes/crepes_suzette.png
312	Haggis	4	3	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741463/teyvatdle/food/def-boosting_dishes/haggis.png
313	Tomates Narbonnaises	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741546/teyvatdle/food/atk-boosting_dishes/tomates_narbonnaises.png
314	Tripes du Port	3	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741625/teyvatdle/food/recovery_dishes/tripes_du_port.png
315	Trout Amandine	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696741731/teyvatdle/food/recovery_dishes/trout_amandine.png
316	"Pure Water"	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697861794/teyvatdle/food/atk-boosting_dishes/pure_water.png
317	Secret Sauce BBQ Ribs	2	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697861911/teyvatdle/food/recovery_dishes/secret_sauce_bbq_ribs.png
318	"Pour la Justice"	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701496069/teyvatdle/food/def-boosting_dishes/pour_la_justice.png
319	Blubber Profiterole	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701496203/teyvatdle/food/atk-boosting_dishes/blubber_profiterole.png
320	Exclusive Scoop: Gourmet Column	3	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701496387/teyvatdle/food/adventurers_dishes/exclusive_scoop_gourmet_column.png
321	La Lettre a Focalors	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701496515/teyvatdle/food/def-boosting_dishes/la_lettre_a_focalors.png
326	"Pick What You Like!"	3	1	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705211764/teyvatdle/food/adventurers_dishes/pick_what_you_like.png
327	Feast-O's	3	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705211977/teyvatdle/food/def-boosting_dishes/feast_os.png
328	Fontinalia Mousse	4	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705212211/teyvatdle/food/atk-boosting_dishes/fontinalia_mousse.png
329	Rainbow Macarons	3	1	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705212282/teyvatdle/food/adventurers_dishes/rainbow_macarons.png
330	Sin: The Kind that Doesn't Need to be Dealt With	3	3	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705212373/teyvatdle/food/def-boosting_dishes/sin_the_kind_that_doesnt_need_to_be_dealt_with.png
331	Braised Meatball	3	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707631052/teyvatdle/food/atk-boosting_dishes/braised_meatball.png
332	Chenyu Brew	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707631170/teyvatdle/food/recovery_dishes/chenyu_brew.png
333	Deep-Fried Doublecrisp	2	4	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707631270/teyvatdle/food/atk-boosting_dishes/deep-fried_doublecrisp.png
334	Eight-Treasure Duck	4	3	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707631360/teyvatdle/food/def-boosting_dishes/eight-treasure_duck.png
335	Encompassing Gladness	3	4	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707631455/teyvatdle/food/atk-boosting_dishes/encompassing_gladness.png
336	Fine Tea, Full Moon	3	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707631635/teyvatdle/food/recovery_dishes/fine_tea_full_moon.png
337	Guhua Fish & Lamb Soup	2	3	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707631783/teyvatdle/food/def-boosting_dishes/guhua_fish_lamb_soup.png
338	Honey Char Siu	1	2	f	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707631919/teyvatdle/food/recovery_dishes/honey_char_siu.png
339	Jadevein Tea Eggs	1	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632057/teyvatdle/food/recovery_dishes/jadevein_tea_eggs.png
340	Tea-Smoked Squab	2	2	f	t	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632134/teyvatdle/food/recovery_dishes/tea-smoked_squab.png
341	Yummy Yum Cha	1	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632200/teyvatdle/food/recovery_dishes/yummy_yum_cha.png
342	"Fashion Show"	3	2	t	f	t	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711257514/teyvatdle/food/recovery_dishes/fashion_show.png
343	Humbly Enough	3	2	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1712469969/teyvatdle/food/recovery_dishes/humbly_enough.png
344	Right at Home	3	3	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1712470038/teyvatdle/food/def-boosting_dishes/right_at_home.png
345	The Palace Jewels	3	3	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1712470096/teyvatdle/food/def-boosting_dishes/the_palace_jewels.png
346	Trembling Strings and Rushing Reeds	3	4	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1712470163/teyvatdle/food/atk-boosting_dishes/trembling_strings_and_rushing_reeds.png
347	Mega-Meaty Sushi	3	2	f	f	t	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1712470243/teyvatdle/food/recovery_dishes/mega-meaty_sushi.png
\.


--
-- TOC entry 4005 (class 0 OID 28763)
-- Dependencies: 293
-- Data for Name: food_type; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.food_type (id, name) FROM stdin;
1	Adventurer's Dishes
2	Recovery Dishes
3	DEF-Boosting Dishes
4	ATK-Boosting Dishes
5	Potions
6	Essential Oils
\.


--
-- TOC entry 4003 (class 0 OID 28749)
-- Dependencies: 291
-- Data for Name: local_specialty; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.local_specialty (id, name, region_id, image_url) FROM stdin;
1	Calla Lily	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689400012/teyvatdle/local_specialty/mondstadt/calla_lily.png
2	Cecilia	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689400136/teyvatdle/local_specialty/mondstadt/cecilia.png
3	Dandelion Seed	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689400252/teyvatdle/local_specialty/mondstadt/dandelion_seed.png
4	Philanemo Mushroom	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689400390/teyvatdle/local_specialty/mondstadt/philanemo_mushroom.png
5	Small Lamp Grass	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689400441/teyvatdle/local_specialty/mondstadt/small_lamp_grass.png
6	Valberry	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689400506/teyvatdle/local_specialty/mondstadt/valberry.png
7	Windwheel Aster	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689400529/teyvatdle/local_specialty/mondstadt/windwheel_aster.png
8	Wolfhook	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689400559/teyvatdle/local_specialty/mondstadt/wolfhook.png
9	Cor Lapis	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543261/teyvatdle/local_specialty/liyue/cor_lapis.png
10	Glaze Lily	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543305/teyvatdle/local_specialty/liyue/glaze_lily.png
11	Jueyun Chili	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543329/teyvatdle/local_specialty/liyue/jueyun_chili.png
12	Noctilucous Jade	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543361/teyvatdle/local_specialty/liyue/noctilucous_jade.png
13	Qingxin	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543396/teyvatdle/local_specialty/liyue/qingxin.png
14	Silk Flower	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543418/teyvatdle/local_specialty/liyue/silk_flower.png
15	Starconch	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543441/teyvatdle/local_specialty/liyue/starconch.png
16	Violetgrass	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543458/teyvatdle/local_specialty/liyue/violetgrass.png
17	Amakumo Fruit	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543503/teyvatdle/local_specialty/inazuma/amakumo_fruit.png
18	Crystal Marrow	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543522/teyvatdle/local_specialty/inazuma/crystal_marrow.png
19	Dendrobium	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543643/teyvatdle/local_specialty/inazuma/dendrobium.png
20	Fluorescent Fungus	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543667/teyvatdle/local_specialty/inazuma/fluorescent_fungus.png
21	Naku Weed	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543689/teyvatdle/local_specialty/inazuma/naku_weed.png
22	Onikabuto	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543740/teyvatdle/local_specialty/inazuma/onikabuto.png
23	Sakura Bloom	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543758/teyvatdle/local_specialty/inazuma/sakura_bloom.png
24	Sango Pearl	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543779/teyvatdle/local_specialty/inazuma/sango_pearl.png
25	Sea Ganoderma	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543799/teyvatdle/local_specialty/inazuma/sea_ganoderma.png
26	Henna Berry	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543856/teyvatdle/local_specialty/sumeru/henna_berry.png
27	Kalpalata Lotus	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543876/teyvatdle/local_specialty/sumeru/kalpalata_lotus.png
28	Mourning Flower	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543893/teyvatdle/local_specialty/sumeru/mourning_flower.png
29	Nilotpala Lotus	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543917/teyvatdle/local_specialty/sumeru/nilotpala_lotus.png
30	Padisarah	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543940/teyvatdle/local_specialty/sumeru/padisarah.png
31	Rukkhashava Mushrooms	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543954/teyvatdle/local_specialty/sumeru/rukkhashava_mushrooms.png
32	Sand Grease Pupa	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543973/teyvatdle/local_specialty/sumeru/sand_grease_pupa.png
33	Scarab	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689543998/teyvatdle/local_specialty/sumeru/scarab.png
34	Trishiraite	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689544015/teyvatdle/local_specialty/sumeru/trishiraite.png
35	Beryl Conch	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692592818/teyvatdle/local_specialty/fontaine/beryl_conch.png
36	Lumidouce Bell	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692592856/teyvatdle/local_specialty/fontaine/lumidouce_bell.png
37	Rainbow Rose	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692592894/teyvatdle/local_specialty/fontaine/rainbow_rose.png
38	Romaritime Flower	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692592921/teyvatdle/local_specialty/fontaine/romaritime_flower.png
39	Lumitoile	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696739975/teyvatdle/local_specialty/fontaine/lumitoile.png
40	Subdetection Unit	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696740025/teyvatdle/local_specialty/fontaine/subdetection_unit.png
41	Lakelight Lily	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701495041/teyvatdle/local_specialty/fontaine/lakelight_lily.png
42	Spring of the First Dewdrop	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701495109/teyvatdle/local_specialty/fontaine/spring_of_the_first_dewdrop.png
43	Clearwater Jade	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707629667/teyvatdle/local_specialty/liyue/clearwater_jade.png
\.


--
-- TOC entry 3979 (class 0 OID 28551)
-- Dependencies: 267
-- Data for Name: region; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.region (id, name) FROM stdin;
1	Mondstadt
2	Liyue
3	Inazuma
4	Sumeru
5	Fontaine
6	Natlan
7	Snezhnaya
\.


--
-- TOC entry 3986 (class 0 OID 28595)
-- Dependencies: 274
-- Data for Name: stat; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.stat (id, name) FROM stdin;
1	Anemo DMG Bonus
2	ATK
3	CRIT DMG
4	CRIT Rate
5	Cryo DMG Bonus
6	DEF
7	Dendro DMG Bonus
8	Electro DMG Bonus
9	Elemental Mastery
10	Energy Recharge
11	Geo DMG Bonus
12	Healing Bonus
13	HP
14	Hydro DMG Bonus
15	Physical DMG Bonus
16	Pyro DMG Bonus
\.


--
-- TOC entry 4014 (class 0 OID 28866)
-- Dependencies: 302
-- Data for Name: talent; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.talent (id, name, character_id, type_id, image_url) FROM stdin;
105	Palm Vortex	19	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345964/teyvatdle/character/other/traveler_anemo/talent/palm_vortex.png
108	Second Wind	19	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346193/teyvatdle/character/other/traveler_anemo/talent/second_wind.png
112	Shattered Darkrock	20	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346397/teyvatdle/character/other/traveler_geo/talent/shattered_darkrock.png
115	Lightning Blade	21	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346557/teyvatdle/character/other/traveler_electro/talent/lightning_blade.png
119	Foreign Fieldcleaver	22	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346729/teyvatdle/character/other/traveler_dendro/talent/foreign_fieldcleaver.png
122	Verdant Overgrowth	22	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346846/teyvatdle/character/other/traveler_dendro/talent/verdant_overgrowth.png
5	Precise Shot	1	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074924/teyvatdle/character/mondstadt/amber/talent/precise_shot.png
8	Let the Show Begin♪	2	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690075088/teyvatdle/character/mondstadt/barbara/talent/let_the_show_begin.png
11	Encore	2	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690075235/teyvatdle/character/mondstadt/barbara/talent/encore.png
21	Fantastic Voyage	4	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690091774/teyvatdle/character/mondstadt/bennett/talent/fantastic_voyage.png
31	Tempered Sword	6	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690091968/teyvatdle/character/mondstadt/diluc/talent/tempered_sword.png
34	Relentless	6	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690092112/teyvatdle/character/mondstadt/diluc/talent/relentless.png
37	Bolts of Downfall	7	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158068/teyvatdle/character/mondstadt/fischl/talent/bolts_of_downfall.png
42	Mein Hausgarten	7	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158258/teyvatdle/character/mondstadt/fischl/talent/mein_hausgarten.png
44	Gale Blade	8	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158368/teyvatdle/character/mondstadt/jean/talent/gale_blade.png
48	Guiding Breeze	8	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158506/teyvatdle/character/mondstadt/jean/talent/guiding_breeze.png
51	Glacial Waltz	9	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158641/teyvatdle/character/mondstadt/kaeya/talent/glacial_waltz.png
61	Lightning Touch	11	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159085/teyvatdle/character/mondstadt/lisa/talent/lightning_touch.png
64	Induced Aftershock	11	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159192/teyvatdle/character/mondstadt/lisa/talent/induced_aftershock.png
68	Mirror Reflection of Doom	12	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159650/teyvatdle/character/mondstadt/mona/talent/mirror_reflection_of_doom.png
71	"Come 'n' Get Me, Hag!"	12	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159763/teyvatdle/character/mondstadt/mona/talent/come_n_get_me_hag.png
81	Breastplate	14	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159996/teyvatdle/character/mondstadt/noelle/talent/breastplate.png
84	Nice and Clean	14	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160095/teyvatdle/character/mondstadt/noelle/talent/nice_and_clean.png
94	Lightning Fang	16	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160491/teyvatdle/character/mondstadt/razor/talent/lightning_fang.png
97	Wolvensprint	16	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160614/teyvatdle/character/mondstadt/razor/talent/wolvensprint.png
101	Catalyst Conversion	17	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161118/teyvatdle/character/mondstadt/sucrose/talent/catalyst_conversion.png
124	Divine Marksmanship	23	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161269/teyvatdle/character/mondstadt/venti/talent/divine_marksmanship.png
127	Embrace of Winds	23	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161410/teyvatdle/character/mondstadt/venti/talent/embrace_of_winds.png
14	Tidecaller	3	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161895/teyvatdle/character/liyue/beidou/talent/tidecaller.png
18	Conqueror of Tides	3	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162062/teyvatdle/character/liyue/beidou/talent/conqueror_of_tides.png
27	Spirit Blade: Cloud-Parting Star	5	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162228/teyvatdle/character/liyue/chongyun/talent/spirit_blade_cloud-parting_star.png
55	Yunlai Swordsmanship	10	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163051/teyvatdle/character/liyue/keqing/talent/yunlai_swordsmanship.png
58	Thundering Penance	10	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163175/teyvatdle/character/liyue/keqing/talent/thundering_penance.png
75	Jade Screen	13	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163369/teyvatdle/character/liyue/ningguang/talent/jade_screen.png
78	Strategic Reserve	13	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690169612/teyvatdle/character/liyue/ningguang/talent/strategic_reserve.png
88	Adeptus Art: Preserver of Fortune	15	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690169838/teyvatdle/character/liyue/qiqi/talent/adeptus_art_preserver_of_fortune.png
91	Former Life Memories	15	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690169973/teyvatdle/character/liyue/qiqi/talent/former_life_memories.png
133	Crossfire	24	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170507/teyvatdle/character/liyue/xiangling/talent/crossfire.png
161	Sweeping Fervor	29	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171352/teyvatdle/character/liyue/xinyan/talent/sweeping_fervor.png
164	"...Now That's Rock 'N' Roll!"	29	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171509/teyvatdle/character/liyue/xinyan/talent/now_thats_rock_n_roll.png
203	Signed Edict	36	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171672/teyvatdle/character/liyue/yanfei/talent/signed_edict.png
207	Encyclopedic Expertise	36	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171855/teyvatdle/character/liyue/yanfei/talent/encyclopedic_expertise.png
169	Resonant Waves	30	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172968/teyvatdle/character/liyue/zhongli/talent/resonant_waves.png
214	Garyuu Bladework	38	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173760/teyvatdle/character/inazuma/kaedehara_kazuha/talent/garyuu_bladework.png
218	Poetics of Fuubutsu	38	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173918/teyvatdle/character/inazuma/kaedehara_kazuha/talent/poetics_of_fuubutsu.png
222	Kamisato Art: Soumetsu	39	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174143/teyvatdle/character/inazuma/kamisato_ayaka/talent/kamisato_art_soumetsu.png
225	Kanten Senmyou Blessing	39	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174270/teyvatdle/character/inazuma/kamisato_ayaka/talent/kanten_senmyou_blessing.png
246	Tengu Stormcall	43	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175013/teyvatdle/character/inazuma/kujou_sara/talent/tengu_stormcall.png
249	Decorum	43	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175151/teyvatdle/character/inazuma/kujou_sara/talent/decorum.png
253	Secret Art: Musou Shinsetsu	44	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175578/teyvatdle/character/inazuma/raiden_shogun/talent/secret_art_musou_shinsetsu.png
257	The Shape of Water	45	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175768/teyvatdle/character/inazuma/sangonomiya_kokomi/talent/the_shape_of_water.png
359	White Jade Lotus	62	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262369/teyvatdle/character/sumeru/nilou/talent/white_jade_lotus.png
158	Sword of Torrents	28	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345362/teyvatdle/character/snezhnaya/childe/talent/sword_of_torrents.png
240	Frozen Wilds	42	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345550/teyvatdle/character/other/aloy/talent/frozen_wilds.png
243	Strong Strike	42	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345681/teyvatdle/character/other/aloy/talent/strong_strike.png
261	Song of Pearls	45	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175939/teyvatdle/character/inazuma/sangonomiya_kokomi/talent/song_of_pearls.png
227	Shuumatsuban Ninja Blade	40	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176079/teyvatdle/character/inazuma/sayu/talent/shuumatsuban_ninja_blade.png
230	Someone More Capable	40	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176230/teyvatdle/character/inazuma/sayu/talent/someone_more_capable.png
264	Swiftshatter Spear	46	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258562/teyvatdle/character/inazuma/thoma/talent/swiftshatter_spear.png
236	Tricks of the Trouble-Maker	41	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259214/teyvatdle/character/inazuma/yoimiya/talent/tricks_of_the_trouble-maker.png
175	Calcite Might	31	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074291/teyvatdle/character/mondstadt/albedo/talent/calcite_might.png
148	Kätzlein Style	27	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157478/teyvatdle/character/mondstadt/diona/talent/katzlein_style.png
151	Cat's Tail Secret Menu	27	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157593/teyvatdle/character/mondstadt/diona/talent/cats_tail_secret_menu.png
208	Favonius Bladework - Edel	37	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157745/teyvatdle/character/mondstadt/eula/talent/favonius_bladework-edel.png
212	Wellspring of War-Lust	37	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157948/teyvatdle/character/mondstadt/eula/talent/wellspring_of_war-lust.png
143	Jumpy Dumpty	26	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158847/teyvatdle/character/mondstadt/klee/talent/jumpy_dumpty.png
147	All Of My Treasures!	26	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159013/teyvatdle/character/mondstadt/klee/talent/all_of_my_treasures.png
198	Rites of Termination	35	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160751/teyvatdle/character/mondstadt/rosaria/talent/rites_of_termination.png
178	Liutian Archery	32	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162436/teyvatdle/character/liyue/ganyu/talent/liutian_archery.png
181	Undivided Heart	32	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162563/teyvatdle/character/liyue/ganyu/talent/undivided_heart.png
191	Guide to Afterlife	34	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162810/teyvatdle/character/liyue/hu_tao/talent/guide_to_afterlife.png
193	Flutter By	34	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162896/teyvatdle/character/liyue/hu_tao/talent/flutter_by.png
184	Whirlwind Thrust	33	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170670/teyvatdle/character/liyue/xiao/talent/whirlwind_thrust.png
188	Dissolution Eon: Heaven Fall	33	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170878/teyvatdle/character/liyue/xiao/talent/dissolution_eon_heaven_fall.png
136	Guhua Style	25	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171002/teyvatdle/character/liyue/xingqiu/talent/guhua_style.png
139	Hydropathic	25	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171132/teyvatdle/character/liyue/xingqiu/talent/hydropathic.png
358	Dreamy Dance of Aeons	62	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262317/teyvatdle/character/sumeru/nilou/talent/dreamy_dance_of_aeons.png
331	Vijnana-Phala Mine	58	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262463/teyvatdle/character/sumeru/tighnari/talent/vijnana-phala_mine.png
334	Scholarly Blade	58	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262575/teyvatdle/character/sumeru/tighnari/talent/scholarly_blade.png
380	Kyougen: Five Ceremonial Plays	66	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262734/teyvatdle/character/sumeru/wanderer/talent/kyougen_five_ceremonial_plays.png
383	Strum the Swirling Winds	66	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262851/teyvatdle/character/sumeru/wanderer/talent/strum_the_swirling_winds.png
160	Dance on Fire	29	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171299/teyvatdle/character/liyue/xinyan/talent/dance_on_fire.png
309	Turn Control	54	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172348/teyvatdle/character/liyue/yelan/talent/turn_control.png
288	Cloud-Grazing Strike	50	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172534/teyvatdle/character/liyue/yun_jin/talent/cloud-grazing_strike.png
291	True to Oneself	50	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172667/teyvatdle/character/liyue/yun_jin/talent/true_to_oneself.png
271	Masatsu Zetsugi: Akaushi Burst!	47	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173190/teyvatdle/character/inazuma/arataki_itto/talent/masatsu_zetsugi_akaushi_burst.png
285	Deific Embrace	49	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170166/teyvatdle/character/liyue/shenhe/talent/deific_embrace.png
274	Bloodline of the Crimson Oni	47	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173344/teyvatdle/character/inazuma/arataki_itto/talent/bloodline_of_the_crimson_oni.png
278	Juuga: Forward Unto Victory	48	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173570/teyvatdle/character/inazuma/gorou/talent/juuga_forward_unto_victory.png
281	Seeker of Shinies	48	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173704/teyvatdle/character/inazuma/gorou/talent/seeker_of_shinies.png
302	Kamisato Art: Suiyuu	53	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174472/teyvatdle/character/inazuma/kamisato_ayato/talent/kamisato_art_suiyuu.png
305	Kamisato Art: Daily Cooking	53	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174616/teyvatdle/character/inazuma/kamisato_ayato/talent/kamisato_art_daily_cooking.png
315	Breaking Free	55	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175360/teyvatdle/character/inazuma/kuki_shinobu/talent/breaking_free.png
318	Fudou Style Martial Arts	56	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176380/teyvatdle/character/inazuma/shikanoin_heizou/talent/fudou_style_martial_arts.png
322	Penetrative Reasoning	56	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176523/teyvatdle/character/inazuma/shikanoin_heizou/talent/penetrative_reasoning.png
266	Crimson Ooyoroi	46	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258656/teyvatdle/character/inazuma/thoma/talent/crimson_ooyoroi.png
294	Spiritfox Sin-Eater	51	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258828/teyvatdle/character/inazuma/yae_miko/talent/spiritfox_sin-eater.png
297	The Shrine's Sacred Shade	51	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258962/teyvatdle/character/inazuma/yae_miko/talent/the_shrines_sacred_shade.png
385	Universality: An Elaboration on Form	67	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259446/teyvatdle/character/sumeru/alhaitham/talent/universality_an_elaboration_on_form.png
343	Sacred Rite: Heron's Sanctum	60	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259737/teyvatdle/character/sumeru/candace/talent/sacred_rite_herons_sanctum.png
346	Celestial Dome of Sand	60	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259862/teyvatdle/character/sumeru/candace/talent/celestial_dome_of_sand.png
325	Floral Brush	57	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260027/teyvatdle/character/sumeru/collei/talent/floral_brush.png
329	Gliding Champion of Sumeru	57	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260175/teyvatdle/character/sumeru/collei/talent/gliding_champion_of_sumeru.png
350	Sacred Rite: Wolf's Swiftness	61	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260334/teyvatdle/character/sumeru/cyno/talent/sacred_rite_wolfs_swiftness.png
353	The Gift of Silence	61	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260450/teyvatdle/character/sumeru/cyno/talent/the_gift_of_silence.png
338	Alcazarzaray's Exactitude	59	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260825/teyvatdle/character/sumeru/dori/talent/alcazarzarays_exactitude.png
372	Parthian Shot	65	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261011/teyvatdle/character/sumeru/faruzan/talent/parthian_shot.png
375	Impetuous Flow	65	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261158/teyvatdle/character/sumeru/faruzan/talent/impetuous_flow.png
366	Sword of the Radiant Path	64	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261538/teyvatdle/character/sumeru/layla/talent/sword_of_the_radiant_path.png
369	Like Nascent Light	64	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261673/teyvatdle/character/sumeru/layla/talent/like_nascent_light.png
360	Akara	63	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261833/teyvatdle/character/sumeru/nahida/talent/akara.png
364	Awakening Elucidated	63	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261970/teyvatdle/character/sumeru/nahida/talent/awakening_elucidated.png
355	Dance of Haftkarsvar	62	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262103/teyvatdle/character/sumeru/nilou/talent/dance_of_haftkarsvar.png
162	Riff Revolution	29	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171390/teyvatdle/character/liyue/xinyan/talent/riff_revolution.png
391	Raphanus Sky Cluster	68	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171974/teyvatdle/character/liyue/yaoyao/talent/raphanus_sky_cluster.png
394	In Others' Shoes	68	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172102/teyvatdle/character/liyue/yaoyao/talent/in_others_shoes.png
422	Secret Art: Surprise Dispatch	73	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174762/teyvatdle/character/inazuma/kirara/talent/secret_art_surprise_dispatch.png
387	Four-Causal Correction	67	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259561/teyvatdle/character/sumeru/alhaitham/talent/four-causal_correction.png
396	Sandstorm Assault	69	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260508/teyvatdle/character/sumeru/dehya/talent/sandstorm_assault.png
399	Unstinting Succor	69	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260613/teyvatdle/character/sumeru/dehya/talent/unstinting_succor.png
414	Schematic Setup	72	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261297/teyvatdle/character/sumeru/kaveh/talent/schematic_setup.png
418	A Craftsman's Curious Conceptions	72	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261436/teyvatdle/character/sumeru/kaveh/talent/a_craftsmans_curious_conceptions.png
172	Favonius Bladework - Weiss	31	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690072915/teyvatdle/character/mondstadt/albedo/talent/favonius_bladework-weiss.png
173	Abiogenesis: Solar Isotoma	31	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690072975/teyvatdle/character/mondstadt/albedo/talent/abiogenesis_solar_isotoma.png
174	Rite of Progeniture: Tectonic Tide	31	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690073095/teyvatdle/character/mondstadt/albedo/talent/rite_of_progeniture_tectonic_tide.png
176	Homuncular Nature	31	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074342/teyvatdle/character/mondstadt/albedo/talent/homuncular_nature.png
177	Flash of Genius	31	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074392/teyvatdle/character/mondstadt/albedo/talent/flash_of_genius.png
1	Sharpshooter	1	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074742/teyvatdle/character/mondstadt/amber/talent/sharpshooter.png
2	Explosive Puppet	1	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074791/teyvatdle/character/mondstadt/amber/talent/explosive_puppet.png
3	Fiery Rain	1	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074831/teyvatdle/character/mondstadt/amber/talent/fiery_rain.png
4	Every Arrow Finds Its Target	1	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074872/teyvatdle/character/mondstadt/amber/talent/every_arrow_finds_its_target.png
6	Gliding Champion	1	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690074974/teyvatdle/character/mondstadt/amber/talent/gliding_champion.png
7	Whisper of Water	2	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690075049/teyvatdle/character/mondstadt/barbara/talent/whisper_of_water.png
9	Shining Miracle♪	2	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690075159/teyvatdle/character/mondstadt/barbara/talent/shining_miracle.png
10	Glorious Season	2	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690075197/teyvatdle/character/mondstadt/barbara/talent/glorious_season.png
12	With My Whole Heart♪	2	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690075268/teyvatdle/character/mondstadt/barbara/talent/with_my_whole_heart.png
19	Strike of Fortune	4	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690091680/teyvatdle/character/mondstadt/bennett/talent/strike_of_fortune.png
20	Passion Overload	4	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690091735/teyvatdle/character/mondstadt/bennett/talent/passion_overload.png
22	Rekindle	4	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690091814/teyvatdle/character/mondstadt/bennett/talent/rekindle.png
23	Fearnaught	4	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690091854/teyvatdle/character/mondstadt/bennett/talent/fearnaught.png
24	It Should Be Safe...	4	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690091895/teyvatdle/character/mondstadt/bennett/talent/it_should_be_safe.png
32	Searing Onslaught	6	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690092006/teyvatdle/character/mondstadt/diluc/talent/searing_onslaught.png
33	Dawn	6	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690092046/teyvatdle/character/mondstadt/diluc/talent/dawn.png
35	Blessing of Phoenix	6	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690092144/teyvatdle/character/mondstadt/diluc/talent/blessing_of_phoenix.png
36	Tradition of the Dawn Knight	6	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690092190/teyvatdle/character/mondstadt/diluc/talent/tradition_of_the_dawn_knight.png
149	Icy Paws	27	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157519/teyvatdle/character/mondstadt/diona/talent/icy_paws.png
150	Signature Mix	27	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157554/teyvatdle/character/mondstadt/diona/talent/signature_mix.png
152	Drunkards' Farce	27	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157638/teyvatdle/character/mondstadt/diona/talent/drunkards_farce.png
153	Complimentary Bar Food	27	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157680/teyvatdle/character/mondstadt/diona/talent/complimentary_bar_food.png
405	Suppressive Barrage	70	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159488/teyvatdle/character/mondstadt/mika/talent/suppressive_barrage.png
409	Universal Diagnosis	71	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161620/teyvatdle/character/liyue/baizhu/talent/universal_diagnosis.png
412	All Things Are of the Earth	71	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161744/teyvatdle/character/liyue/baizhu/talent/all_things_are_of_the_earth.png
209	Icetide Vortex	37	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157817/teyvatdle/character/mondstadt/eula/talent/icetide_vortex.png
210	Glacial Illumination	37	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157855/teyvatdle/character/mondstadt/eula/talent/glacial_illumination.png
211	Roiling Rime	37	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157893/teyvatdle/character/mondstadt/eula/talent/roiling_rime.png
213	Aristocratic Introspection	37	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690157991/teyvatdle/character/mondstadt/eula/talent/aristocratic_introspection.png
38	Nightrider	7	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158103/teyvatdle/character/mondstadt/fischl/talent/nightrider.png
39	Midnight Phantasmagoria	7	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158133/teyvatdle/character/mondstadt/fischl/talent/midnight_phantasmagoria.png
40	Stellar Predator	7	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158167/teyvatdle/character/mondstadt/fischl/talent/stellar_predator.png
41	Undone Be Thy Sinful Hex	7	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158204/teyvatdle/character/mondstadt/fischl/talent/undone_be_thy_sinful_hex.png
43	Favonius Bladework	8	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158335/teyvatdle/character/mondstadt/jean/talent/favonius_bladework.png
45	Dandelion Breeze	8	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158398/teyvatdle/character/mondstadt/jean/talent/dandelion_breeze.png
46	Wind Companion	8	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158431/teyvatdle/character/mondstadt/jean/talent/wind_companion.png
47	Let the Wind Lead	8	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158468/teyvatdle/character/mondstadt/jean/talent/let_the_wind_lead.png
49	Ceremonial Bladework	9	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158565/teyvatdle/character/mondstadt/kaeya/talent/ceremonial_bladework.png
50	Frostgnaw	9	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158608/teyvatdle/character/mondstadt/kaeya/talent/frostgnaw.png
52	Cold-Blooded Strike	9	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158679/teyvatdle/character/mondstadt/kaeya/talent/cold-blooded_strike.png
53	Glacial Heart	9	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158711/teyvatdle/character/mondstadt/kaeya/talent/glacial_heart.png
54	Hidden Strength	9	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158759/teyvatdle/character/mondstadt/kaeya/talent/hidden_strength.png
142	Kaboom!	26	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158814/teyvatdle/character/mondstadt/klee/talent/kaboom.png
144	Sparks 'n' Splash	26	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158888/teyvatdle/character/mondstadt/klee/talent/sparks_n_splash.png
145	Pounding Surprise	26	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158929/teyvatdle/character/mondstadt/klee/talent/pounding_surprise.png
146	Sparkling Burst	26	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690158968/teyvatdle/character/mondstadt/klee/talent/sparkling_burst.png
62	Violet Arc	11	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159121/teyvatdle/character/mondstadt/lisa/talent/violet_arc.png
63	Lightning Rose	11	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159157/teyvatdle/character/mondstadt/lisa/talent/lightning_rose.png
65	Static Electricity Field	11	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159228/teyvatdle/character/mondstadt/lisa/talent/static_electricity_field.png
66	General Pharmaceutics	11	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159266/teyvatdle/character/mondstadt/lisa/talent/general_pharmaceutics.png
402	Spear of Favonius - Arrow's Passage	70	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159350/teyvatdle/character/mondstadt/mika/talent/spear_of_favonius-arrows_passage.png
403	Starfrost Swirl	70	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159416/teyvatdle/character/mondstadt/mika/talent/starfrost_swirl.png
404	Skyfeather Song	70	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159450/teyvatdle/character/mondstadt/mika/talent/skyfeather_song.png
406	Topographical Mapping	70	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159521/teyvatdle/character/mondstadt/mika/talent/topographical_mapping.png
407	Demarcation	70	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159556/teyvatdle/character/mondstadt/mika/talent/demarcation.png
67	Ripple of Fate	12	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159606/teyvatdle/character/mondstadt/mona/talent/ripple_of_fate.png
69	Stellaris Phantasm	12	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159690/teyvatdle/character/mondstadt/mona/talent/stellaris_phantasm.png
70	Illusory Torrent	12	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159723/teyvatdle/character/mondstadt/mona/talent/illusory_torrent.png
72	Waterborne Destiny	12	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159835/teyvatdle/character/mondstadt/mona/talent/waterborne_destiny.png
73	Principium of Astrology	12	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159875/teyvatdle/character/mondstadt/mona/talent/principium_of_astrology.png
80	Favonius Bladework - Maid	14	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690159948/teyvatdle/character/mondstadt/noelle/talent/favonius_bladework-maid.png
82	Sweeping Time	14	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160027/teyvatdle/character/mondstadt/noelle/talent/sweeping_time.png
83	Devotion	14	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160062/teyvatdle/character/mondstadt/noelle/talent/devotion.png
85	Maid's Knighthood	14	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160134/teyvatdle/character/mondstadt/noelle/talent/maids_knighthood.png
92	Steel Fang	16	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160406/teyvatdle/character/mondstadt/razor/talent/steel_fang.png
93	Claw and Thunder	16	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160452/teyvatdle/character/mondstadt/razor/talent/claw_and_thunder.png
95	Awakening	16	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160531/teyvatdle/character/mondstadt/razor/talent/awakening.png
96	Hunger	16	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160569/teyvatdle/character/mondstadt/razor/talent/hunger.png
196	Spear of the Church	35	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160673/teyvatdle/character/mondstadt/rosaria/talent/spear_of_the_church.png
197	Ravaging Confession	35	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160711/teyvatdle/character/mondstadt/rosaria/talent/ravaging_confession.png
199	Regina Probationum	35	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160791/teyvatdle/character/mondstadt/rosaria/talent/regina_probationum.png
200	Shadow Samaritan	35	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160823/teyvatdle/character/mondstadt/rosaria/talent/shadow_samaritan.png
201	Night Walk	35	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160877/teyvatdle/character/mondstadt/rosaria/talent/night_walk.png
98	Wind Spirit Creation	17	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160945/teyvatdle/character/mondstadt/sucrose/talent/wind_spirit_creation.png
99	Astable Anemohypostasis Creation - 6308	17	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690160984/teyvatdle/character/mondstadt/sucrose/talent/astable_anemohypostasis_creation-6308.png
100	Forbidden Creation - Isomer 75 / Type II	17	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161040/teyvatdle/character/mondstadt/sucrose/talent/forbidden_creation-isomer75_type_ii.png
102	Mollis Favonius	17	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161156/teyvatdle/character/mondstadt/sucrose/talent/mollis_favonius.png
103	Astable Invention	17	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161201/teyvatdle/character/mondstadt/sucrose/talent/astable_invention.png
125	Skyward Sonnet	23	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161311/teyvatdle/character/mondstadt/venti/talent/skyward_sonnet.png
126	Wind's Grand Ode	23	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161353/teyvatdle/character/mondstadt/venti/talent/winds_grand_ode.png
128	Stormeye	23	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161450/teyvatdle/character/mondstadt/venti/talent/stormeye.png
129	Windrider	23	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161484/teyvatdle/character/mondstadt/venti/talent/windrider.png
408	The Classics of Acupuncture	71	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161581/teyvatdle/character/liyue/baizhu/talent/the_classics_of_acupuncture.png
410	Holistic Revivification	71	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161658/teyvatdle/character/liyue/baizhu/talent/holistic_revivification.png
411	Five Fortunes Forever	71	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161702/teyvatdle/character/liyue/baizhu/talent/five_fortunes_forever.png
413	Herbal Nourishment	71	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161799/teyvatdle/character/liyue/baizhu/talent/herbal_nourishment.png
13	Oceanborne	3	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161859/teyvatdle/character/liyue/beidou/talent/oceanborne.png
15	Stormbreaker	3	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161931/teyvatdle/character/liyue/beidou/talent/stormbreaker.png
16	Retribution	3	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690161985/teyvatdle/character/liyue/beidou/talent/retribution.png
17	Lightning Storm	3	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162024/teyvatdle/character/liyue/beidou/talent/lightning_storm.png
25	Demonbane	5	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162136/teyvatdle/character/liyue/chongyun/talent/demonbane.png
26	Spirit Blade: Chonghua's Layered Frost	5	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162176/teyvatdle/character/liyue/chongyun/talent/spirit_blade_chonghuas_layered_frost.png
28	Steady Breathing	5	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162272/teyvatdle/character/liyue/chongyun/talent/steady_breathing.png
29	Rimechaser Blade	5	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162310/teyvatdle/character/liyue/chongyun/talent/rimechaser_blade.png
30	Gallant Journey	5	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162352/teyvatdle/character/liyue/chongyun/talent/gallant_journey.png
179	Trail of the Qilin	32	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162482/teyvatdle/character/liyue/ganyu/talent/trail_of_the_qilin.png
180	Celestial Shower	32	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162523/teyvatdle/character/liyue/ganyu/talent/celestial_shower.png
182	Harmony between Heaven and Earth	32	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162604/teyvatdle/character/liyue/ganyu/talent/harmony_between_heaven_and_earth.png
183	Preserved for the Hunt	32	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162653/teyvatdle/character/liyue/ganyu/talent/preserved_for_the_hunt.png
190	Secret Spear of Wangsheng	34	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162759/teyvatdle/character/liyue/hu_tao/talent/secret_spear_of_wangsheng.png
192	Spirit Soother	34	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162857/teyvatdle/character/liyue/hu_tao/talent/spirit_soother.png
194	Sanguine Rouge	34	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162936/teyvatdle/character/liyue/hu_tao/talent/sanguine_rouge.png
195	The More the Merrier	34	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690162972/teyvatdle/character/liyue/hu_tao/talent/the_more_the_merrier.png
56	Stellar Restoration	10	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163098/teyvatdle/character/liyue/keqing/talent/stellar_restoration.png
57	Starward Sword	10	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163138/teyvatdle/character/liyue/keqing/talent/starward_sword.png
59	Aristocratic Dignity	10	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163229/teyvatdle/character/liyue/keqing/talent/aristocratic_dignity.png
60	Land's Overseer	10	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163266/teyvatdle/character/liyue/keqing/talent/lands_overseer.png
74	Sparkling Scatter	13	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163332/teyvatdle/character/liyue/ningguang/talent/sparkling_scatter.png
76	Starshatter	13	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163402/teyvatdle/character/liyue/ningguang/talent/starshatter.png
77	Backup Plan	13	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690163443/teyvatdle/character/liyue/ningguang/talent/backup_plan.png
79	Trove of Marvelous Treasures	13	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690169658/teyvatdle/character/liyue/ningguang/talent/trove_of_marvelous_treasures.png
86	Ancient Sword Art	15	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690169735/teyvatdle/character/liyue/qiqi/talent/ancient_sword_art.png
87	Adeptus Art: Herald of Frost	15	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690169781/teyvatdle/character/liyue/qiqi/talent/adeptus_art_herald_of_frost.png
89	Life-Prolonging Methods	15	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690169883/teyvatdle/character/liyue/qiqi/talent/life-prolonging_methods.png
90	A Glimpse Into Arcanum	15	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690169921/teyvatdle/character/liyue/qiqi/talent/a_glimpse_into_arcanum.png
282	Dawnstar Piercer	49	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170042/teyvatdle/character/liyue/shenhe/talent/dawnstar_piercer.png
283	Spring Spirit Summoning	49	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170088/teyvatdle/character/liyue/shenhe/talent/spring_spirit_summoning.png
284	Divine Maiden's Deliverance	49	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170124/teyvatdle/character/liyue/shenhe/talent/divine_maidens_deliverance.png
286	Spirit Communion Seal	49	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170220/teyvatdle/character/liyue/shenhe/talent/spirit_communion_seal.png
287	Precise Comings and Goings	49	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170260/teyvatdle/character/liyue/shenhe/talent/precise_comings_and_goings.png
130	Dough-Fu	24	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170321/teyvatdle/character/liyue/xiangling/talent/dough-fu.png
131	Guoba Attack	24	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170366/teyvatdle/character/liyue/xiangling/talent/guoba_attack.png
132	Pyronado	24	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170404/teyvatdle/character/liyue/xiangling/talent/pyronado.png
134	Beware, It's Super Hot!	24	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170544/teyvatdle/character/liyue/xiangling/talent/beware_its_super_hot.png
135	Chef de Cuisine	24	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170614/teyvatdle/character/liyue/xiangling/talent/chef_de_cuisine.png
185	Lemniscatic Wind Cycling	33	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170721/teyvatdle/character/liyue/xiao/talent/lemniscatic_wind_cycling.png
186	Bane of All Evil	33	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170774/teyvatdle/character/liyue/xiao/talent/bane_of_all_evil.png
187	Conqueror of Evil: Tamer of Demons	33	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170823/teyvatdle/character/liyue/xiao/talent/conqueror_of_evil_tamer_of_demons.png
189	Transcension: Gravity Defier	33	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690170932/teyvatdle/character/liyue/xiao/talent/transcension_gravity_defier.png
137	Guhua Sword: Fatal Rainscreen	25	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171042/teyvatdle/character/liyue/xingqiu/talent/guhua_sword_fatal_rainscreen.png
138	Guhua Sword: Raincutter	25	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171096/teyvatdle/character/liyue/xingqiu/talent/guhua_sword_raincutter.png
140	Blades Amidst Raindrops	25	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171167/teyvatdle/character/liyue/xingqiu/talent/blades_amidst_raindrops.png
141	Flash of Genius	25	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171227/teyvatdle/character/liyue/xingqiu/talent/flash_of_genius.png
163	"The Show Goes On, Even Without An Audience..."	29	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171442/teyvatdle/character/liyue/xinyan/talent/the_show_goes_on_even_without_an_audience.png
165	A Rad Recipe	29	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171572/teyvatdle/character/liyue/xinyan/talent/a_rad_recipe.png
202	Seal of Approval	36	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171626/teyvatdle/character/liyue/yanfei/talent/seal_of_approval.png
204	Done Deal	36	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171707/teyvatdle/character/liyue/yanfei/talent/done_deal.png
205	Proviso	36	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171767/teyvatdle/character/liyue/yanfei/talent/proviso.png
206	Blazing Eye	36	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171815/teyvatdle/character/liyue/yanfei/talent/blazing_eye.png
390	Toss 'N' Turn Spear	68	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690171922/teyvatdle/character/liyue/yaoyao/talent/toss_n_turn_spear.png
392	Moonjade Descent	68	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172018/teyvatdle/character/liyue/yaoyao/talent/moonjade_descent.png
393	Starscatter	68	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172063/teyvatdle/character/liyue/yaoyao/talent/starscatter.png
395	Tailing on Tiptoes	68	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172139/teyvatdle/character/liyue/yaoyao/talent/tailing_on_tiptoes.png
306	Stealthy Bowshot	54	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172229/teyvatdle/character/liyue/yelan/talent/stealthy_bowshot.png
307	Lingering Lifeline	54	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172270/teyvatdle/character/liyue/yelan/talent/lingering_lifeline.png
308	Depth-Clarion Dice	54	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172310/teyvatdle/character/liyue/yelan/talent/depth-clarion_dice.png
310	Adapt With Ease	54	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172382/teyvatdle/character/liyue/yelan/talent/adapt_with_ease.png
311	Necessary Calculation	54	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172425/teyvatdle/character/liyue/yelan/talent/necessary_calculation.png
289	Opening Flourish	50	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172576/teyvatdle/character/liyue/yun_jin/talent/opening_flourish.png
290	Cliffbreaker's Banner	50	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172619/teyvatdle/character/liyue/yun_jin/talent/cliffbreakers_banner.png
292	Breaking Conventions	50	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172717/teyvatdle/character/liyue/yun_jin/talent/breaking_conventions.png
293	Light Nourishment	50	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172757/teyvatdle/character/liyue/yun_jin/talent/light_nourishment.png
166	Rain of Stone	30	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172855/teyvatdle/character/liyue/zhongli/talent/rain_of_stone.png
167	Dominus Lapidis	30	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172896/teyvatdle/character/liyue/zhongli/talent/dominus_lapidis.png
168	Planet Befall	30	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690172928/teyvatdle/character/liyue/zhongli/talent/planet_befall.png
170	Dominance of Earth	30	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173004/teyvatdle/character/liyue/zhongli/talent/dominance_of_earth.png
171	Arcanum of Crystal	30	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173044/teyvatdle/character/liyue/zhongli/talent/arcanum_of_crystal.png
270	Fight Club Legend	47	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173142/teyvatdle/character/inazuma/arataki_itto/talent/fight_club_legend.png
272	Royal Descent: Behold, Itto the Evil!	47	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173232/teyvatdle/character/inazuma/arataki_itto/talent/royal_descent_behold_itto_the_evil.png
273	Arataki Ichiban	47	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173299/teyvatdle/character/inazuma/arataki_itto/talent/arataki_ichiban.png
275	Woodchuck Chucked	47	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173397/teyvatdle/character/inazuma/arataki_itto/talent/woodchuck_chucked.png
276	Ripping Fang Fletching	48	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173461/teyvatdle/character/inazuma/gorou/talent/ripping_fang_fletching.png
277	Inuzaka All-Round Defense	48	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173524/teyvatdle/character/inazuma/gorou/talent/inuzaka_all-round_defense.png
279	Heedless of the Wind and Weather	48	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173615/teyvatdle/character/inazuma/gorou/talent/heedless_of_the_wind_and_weather.png
280	A Favor Repaid	48	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173665/teyvatdle/character/inazuma/gorou/talent/a_favor_repaid.png
215	Chihayaburu	38	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173802/teyvatdle/character/inazuma/kaedehara_kazuha/talent/chihayaburu.png
216	Kazuha Slash	38	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173837/teyvatdle/character/inazuma/kaedehara_kazuha/talent/kazuha_slash.png
217	Soumon Swordsmanship	38	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173877/teyvatdle/character/inazuma/kaedehara_kazuha/talent/soumon_swordsmanship.png
219	Cloud Strider	38	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690173961/teyvatdle/character/inazuma/kaedehara_kazuha/talent/cloud_strider.png
220	Kamisato Art: Kabuki	39	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174048/teyvatdle/character/inazuma/kamisato_ayaka/talent/kamisato_art_kabuki.png
221	Kamisato Art: Hyouka	39	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174096/teyvatdle/character/inazuma/kamisato_ayaka/talent/kamisato_art_hyouka.png
223	Kamisato Art: Senho	39	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174186/teyvatdle/character/inazuma/kamisato_ayaka/talent/kamisato_art_senho.png
224	Amatsumi Kunitsumi Sanctification	39	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174226/teyvatdle/character/inazuma/kamisato_ayaka/talent/amatsumi_kunitsumi_sanctification.png
226	Fruits of Shinsa	39	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174312/teyvatdle/character/inazuma/kamisato_ayaka/talent/fruits_of_shinsa.png
300	Kamisato Art: Marobashi	53	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174392/teyvatdle/character/inazuma/kamisato_ayato/talent/kamisato_art_marobashi.png
301	Kamisato Art: Kyouka	53	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174432/teyvatdle/character/inazuma/kamisato_ayato/talent/kamisato_art_kyouka.png
303	Kamisato Art: Mine Wo Matoishi Kiyotaki	53	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174518/teyvatdle/character/inazuma/kamisato_ayato/talent/kamisato_art_mine_wo_matoishi_kiyotaki.png
304	Kamisato Art: Michiyuku Hagetsu	53	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174570/teyvatdle/character/inazuma/kamisato_ayato/talent/kamisato_art_michiyuku_hagetsu.png
420	Boxcutter	73	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174679/teyvatdle/character/inazuma/kirara/talent/boxcutter.png
421	Meow-teor Kick	73	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174718/teyvatdle/character/inazuma/kirara/talent/meow-teor_kick.png
423	Bewitching, Betwitching Tails	73	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174809/teyvatdle/character/inazuma/kirara/talent/bewitching_betwitching_tails.png
424	Pupillary Variance	73	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174851/teyvatdle/character/inazuma/kirara/talent/pupillary_variance.png
425	Cat's Creeping Carriage	73	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174891/teyvatdle/character/inazuma/kirara/talent/cats_creeping_carriage.png
245	Tengu Bowmanship	43	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690174972/teyvatdle/character/inazuma/kujou_sara/talent/tengu_bowmanship.png
247	Subjugation: Koukou Sendou	43	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175057/teyvatdle/character/inazuma/kujou_sara/talent/subjugation_koukou_sendou.png
248	Immovable Will	43	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175111/teyvatdle/character/inazuma/kujou_sara/talent/immovable_will.png
250	Land Survey	43	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175185/teyvatdle/character/inazuma/kujou_sara/talent/land_survey.png
312	Shinobu's Shadowsword	55	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175248/teyvatdle/character/inazuma/kuki_shinobu/talent/shinobus_shadowsword.png
313	Sanctifying Ring	55	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175286/teyvatdle/character/inazuma/kuki_shinobu/talent/sanctifying_ring.png
314	Gyoei Narukami Kariyama Rite	55	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175320/teyvatdle/character/inazuma/kuki_shinobu/talent/gyoei_narukami_kariyama_rite.png
316	Heart's Repose	55	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175407/teyvatdle/character/inazuma/kuki_shinobu/talent/hearts_repose.png
317	Protracted Prayers	55	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175444/teyvatdle/character/inazuma/kuki_shinobu/talent/protracted_prayers.png
251	Origin	44	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175496/teyvatdle/character/inazuma/raiden_shogun/talent/origin.png
252	Transcendence: Baleful Omen	44	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175533/teyvatdle/character/inazuma/raiden_shogun/talent/transcendence_baleful_omen.png
254	Wishes Unnumbered	44	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175624/teyvatdle/character/inazuma/raiden_shogun/talent/wishes_unnumbered.png
255	Enlightened One	44	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175664/teyvatdle/character/inazuma/raiden_shogun/talent/enlightened_one.png
256	All-Preserver	44	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175700/teyvatdle/character/inazuma/raiden_shogun/talent/all-preserver.png
258	Kurage's Oath	45	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175820/teyvatdle/character/inazuma/sangonomiya_kokomi/talent/kurages_oath.png
259	Nereid's Ascension	45	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175866/teyvatdle/character/inazuma/sangonomiya_kokomi/talent/nereids_ascension.png
260	Tamakushi Casket	45	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175904/teyvatdle/character/inazuma/sangonomiya_kokomi/talent/tamakushi_casket.png
262	Princess of Watatsumi	45	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690175977/teyvatdle/character/inazuma/sangonomiya_kokomi/talent/princess_of_watatsumi.png
263	Flawless Strategy	45	8	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176016/teyvatdle/character/inazuma/sangonomiya_kokomi/talent/flawless_strategy.png
228	Yoohoo Art: Fuuin Dash	40	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176126/teyvatdle/character/inazuma/sayu/talent/yoohoo_art_fuuin_dash.png
229	Yoohoo Art: Mujina Flurry	40	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176182/teyvatdle/character/inazuma/sayu/talent/yoohoo_art_mujina_flurry.png
231	No Work Today!	40	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176271/teyvatdle/character/inazuma/sayu/talent/no_work_today.png
232	Yoohoo Art: Silencer's Secret	40	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176319/teyvatdle/character/inazuma/sayu/talent/yoohoo_art_silencers_secret.png
319	Heartstopper Strike	56	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176422/teyvatdle/character/inazuma/shikanoin_heizou/talent/heartstopper_strike.png
320	Windmuster Kick	56	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176454/teyvatdle/character/inazuma/shikanoin_heizou/talent/windmuster_kick.png
321	Paradoxical Practice	56	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176488/teyvatdle/character/inazuma/shikanoin_heizou/talent/paradoxical_practice.png
323	Pre-Existing Guilt	56	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690176555/teyvatdle/character/inazuma/shikanoin_heizou/talent/pre-existing_guilt.png
265	Blazing Blessing	46	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258620/teyvatdle/character/inazuma/thoma/talent/blazing_blessing.png
267	Imbricated Armor	46	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258694/teyvatdle/character/inazuma/thoma/talent/imbricated_armor.png
268	Flaming Assault	46	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258730/teyvatdle/character/inazuma/thoma/talent/flaming_assault.png
269	Snap and Swing	46	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258772/teyvatdle/character/inazuma/thoma/talent/snap_and_swing.png
295	Yakan Evocation: Sesshou Sakura	51	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258868/teyvatdle/character/inazuma/yae_miko/talent/yakan_evocation_sesshou_sakura.png
296	Great Secret Art: Tenko Kenshin	51	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690258912/teyvatdle/character/inazuma/yae_miko/talent/great_secret_art_tenko_kenshin.png
298	Enlightened Blessing	51	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259003/teyvatdle/character/inazuma/yae_miko/talent/enlightened_blessing.png
299	Meditations of a Yako	51	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259038/teyvatdle/character/inazuma/yae_miko/talent/meditations_of_a_yako.png
233	Firework Flare-Up	41	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259091/teyvatdle/character/inazuma/yoimiya/talent/firework_flare-up.png
234	Niwabi Fire-Dance	41	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259134/teyvatdle/character/inazuma/yoimiya/talent/niwabi_fire-dance.png
235	Ryuukin Saxifrage	41	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259176/teyvatdle/character/inazuma/yoimiya/talent/ryuukin_saxifrage.png
237	Summer Night's Dawn	41	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259259/teyvatdle/character/inazuma/yoimiya/talent/summer_nights_dawn.png
238	Blazing Match	41	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259304/teyvatdle/character/inazuma/yoimiya/talent/blazing_match.png
384	Abductive Reasoning	67	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259410/teyvatdle/character/sumeru/alhaitham/talent/abductive_reasoning.png
386	Particular Field: Fetters of Phenomena	67	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259493/teyvatdle/character/sumeru/alhaitham/talent/particular_field_fetters_of_phenomena.png
388	Mysteries Laid Bare	67	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259595/teyvatdle/character/sumeru/alhaitham/talent/mysteries_laid_bare.png
389	Law of Reductive Overdetermination	67	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259637/teyvatdle/character/sumeru/alhaitham/talent/law_of_reductive_overdetermination.png
342	Gleaming Spear - Guardian Stance	60	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259693/teyvatdle/character/sumeru/candace/talent/gleaming_spear-guardian_stance.png
344	Sacred Rite: Wagtail's Tide	60	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259782/teyvatdle/character/sumeru/candace/talent/sacred_rite_wagtails_tide.png
345	Aegis of Crossed Arrows	60	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259823/teyvatdle/character/sumeru/candace/talent/aegis_of_crossed_arrows.png
347	To Dawn's First Light	60	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259907/teyvatdle/character/sumeru/candace/talent/to_dawns_first_light.png
324	Supplicant's Bowmanship	57	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690259990/teyvatdle/character/sumeru/collei/talent/supplicants_bowmanship.png
326	Trump-Card Kitty	57	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260061/teyvatdle/character/sumeru/collei/talent/trump-card_kitty.png
327	Floral Sidewinder	57	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260104/teyvatdle/character/sumeru/collei/talent/floral_sidewinder.png
328	The Languid Wood	57	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260137/teyvatdle/character/sumeru/collei/talent/the_languid_wood.png
348	Invoker's Spear	61	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260254/teyvatdle/character/sumeru/cyno/talent/invokers_spear.png
349	Secret Rite: Chasmic Soulfarer	61	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260291/teyvatdle/character/sumeru/cyno/talent/secret_rite_chasmic_soulfarer.png
351	Featherfall Judgment	61	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260376/teyvatdle/character/sumeru/cyno/talent/featherfall_judgment.png
352	Authority Over the Nine Bows	61	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260410/teyvatdle/character/sumeru/cyno/talent/authority_over_the_nine_bows.png
397	Molten Inferno	69	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260542/teyvatdle/character/sumeru/dehya/talent/molten_inferno.png
398	Leonine Bite	69	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260574/teyvatdle/character/sumeru/dehya/talent/leonine_bite.png
400	Stalwart and True	69	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260649/teyvatdle/character/sumeru/dehya/talent/stalwart_and_true.png
401	The Sunlit Way	69	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260686/teyvatdle/character/sumeru/dehya/talent/the_sunlit_way.png
336	Marvelous Sword-Dance (Modified)	59	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260742/teyvatdle/character/sumeru/dori/talent/marvelous_sword-dance_modified.png
337	Spirit-Warding Lamp: Troubleshooter Cannon	59	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260782/teyvatdle/character/sumeru/dori/talent/spirit-warding_lamp_troubleshooter_cannon.png
339	An Eye for Gold	59	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260860/teyvatdle/character/sumeru/dori/talent/an_eye_for_gold.png
340	Compound Interest	59	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260898/teyvatdle/character/sumeru/dori/talent/compound_interest.png
341	Unexpected Order	59	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690260935/teyvatdle/character/sumeru/dori/talent/unexpected_order.png
373	Wind Realm of Nasamjnin	65	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261052/teyvatdle/character/sumeru/faruzan/talent/wind_realm_of_nasamjnin.png
374	The Wind's Secret Ways	65	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261110/teyvatdle/character/sumeru/faruzan/talent/the_winds_secret_ways.png
376	Lost Wisdom of the Seven Caverns	65	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261191/teyvatdle/character/sumeru/faruzan/talent/lost_wisdom_of_the_seven_caverns.png
377	Tomes Light the Path	65	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261238/teyvatdle/character/sumeru/faruzan/talent/tomes_light_the_path.png
415	Artistic Ingenuity	72	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261328/teyvatdle/character/sumeru/kaveh/talent/artistic_ingenuity.png
416	Painted Dome	72	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261361/teyvatdle/character/sumeru/kaveh/talent/painted_dome.png
417	An Architect's Undertaking	72	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261396/teyvatdle/character/sumeru/kaveh/talent/an_architects_undertaking.png
419	The Art of Budgeting	72	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261478/teyvatdle/character/sumeru/kaveh/talent/the_art_of_budgeting.png
367	Nights of Formal Focus	64	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261581/teyvatdle/character/sumeru/layla/talent/nights_of_formal_focus.png
368	Dream of the Star-Stream Shaker	64	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261626/teyvatdle/character/sumeru/layla/talent/dream_of_the_star-stream_shaker.png
370	Sweet Slumber Undisturbed	64	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261718/teyvatdle/character/sumeru/layla/talent/sweet_slumber_undisturbed.png
371	Shadowy Dream-Signs	64	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261751/teyvatdle/character/sumeru/layla/talent/shadowy_dream-signs.png
361	All Schemes to Know	63	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261867/teyvatdle/character/sumeru/nahida/talent/all_schemes_to_know.png
362	Illusory Heart	63	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261907/teyvatdle/character/sumeru/nahida/talent/illusory_heart.png
363	Compassion Illuminated	63	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690261940/teyvatdle/character/sumeru/nahida/talent/compassion_illuminated.png
365	On All Things Meditated	63	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262006/teyvatdle/character/sumeru/nahida/talent/on_all_things_meditated.png
354	Dance of Samser	62	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262069/teyvatdle/character/sumeru/nilou/talent/dance_of_samser.png
356	Dance of Abzendegi: Distant Dreams, Listening Spring	62	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262149/teyvatdle/character/sumeru/nilou/talent/dance_of_abzendegi_distant_dreams_listening_spring.png
357	Court of Dancing Petals	62	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262229/teyvatdle/character/sumeru/nilou/talent/court_of_dancing_petals.png
330	Khanda Barrier-Buster	58	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262427/teyvatdle/character/sumeru/tighnari/talent/khanda_barrier-buster.png
332	Fashioner's Tanglevine Shaft	58	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262503/teyvatdle/character/sumeru/tighnari/talent/fashioners_tanglevine_shaft.png
333	Keen Sight	58	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262539/teyvatdle/character/sumeru/tighnari/talent/keen_sight.png
335	Encyclopedic Knowledge	58	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262607/teyvatdle/character/sumeru/tighnari/talent/encyclopedic_knowledge.png
378	Yuuban Meigen	66	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262659/teyvatdle/character/sumeru/wanderer/talent/yuuban_meigen.png
379	Hanega: Song of the Wind	66	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262695/teyvatdle/character/sumeru/wanderer/talent/hanega_song_of_the_wind.png
381	Jade-Claimed Flower	66	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262777/teyvatdle/character/sumeru/wanderer/talent/jade-claimed_flower.png
382	Gales of Reverie	66	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690262817/teyvatdle/character/sumeru/wanderer/talent/gales_of_reverie.png
154	Cutting Torrent	28	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345151/teyvatdle/character/snezhnaya/childe/talent/cutting_torrent.png
155	Foul Legacy: Raging Tide	28	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345201/teyvatdle/character/snezhnaya/childe/talent/foul_legacy_raging_tide.png
156	Havoc: Obliteration	28	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345253/teyvatdle/character/snezhnaya/childe/talent/havoc_obliteration.png
157	Never Ending	28	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345304/teyvatdle/character/snezhnaya/childe/talent/never_ending.png
159	Master of Weaponry	28	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345436/teyvatdle/character/snezhnaya/childe/talent/master_of_weaponry.png
239	Rapid Fire	42	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345509/teyvatdle/character/other/aloy/talent/rapid_fire.png
241	Prophecies of Dawn	42	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345598/teyvatdle/character/other/aloy/talent/prophecies_of_dawn.png
242	Combat Override	42	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345646/teyvatdle/character/other/aloy/talent/combat_override.png
244	Easy Does It	42	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345720/teyvatdle/character/other/aloy/talent/easy_does_it.png
104	Foreign Ironwind	19	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690345905/teyvatdle/character/other/traveler_anemo/talent/foreign_ironwind.png
106	Gust Surge	19	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346048/teyvatdle/character/other/traveler_anemo/talent/gust_surge.png
107	Slitting Wind	19	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346088/teyvatdle/character/other/traveler_anemo/talent/slitting_wind.png
109	Foreign Rockblade	20	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346270/teyvatdle/character/other/traveler_geo/talent/foreign_rockblade.png
110	Starfell Sword	20	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346303/teyvatdle/character/other/traveler_geo/talent/starfell_sword.png
111	Wake of Earth	20	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346349/teyvatdle/character/other/traveler_geo/talent/wake_of_earth.png
113	Frenzied Rockslide	20	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346438/teyvatdle/character/other/traveler_geo/talent/frenzied_rockslide.png
114	Foreign Thundershock	21	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346487/teyvatdle/character/other/traveler_electro/talent/foreign_thundershock.png
116	Bellowing Thunder	21	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346592/teyvatdle/character/other/traveler_electro/talent/bellowing_thunder.png
117	Thunderflash	21	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346635/teyvatdle/character/other/traveler_electro/talent/thunderflash.png
118	Resounding Roar	21	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346668/teyvatdle/character/other/traveler_electro/talent/resounding_roar.png
120	Razorgrass Blade	22	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346761/teyvatdle/character/other/traveler_dendro/talent/razorgrass_blade.png
121	Surgent Manifestation	22	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346797/teyvatdle/character/other/traveler_dendro/talent/surgent_manifestation.png
123	Verdant Luxury	22	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690346884/teyvatdle/character/other/traveler_dendro/talent/verdant_luxury.png
426	Rapid Ritesword	74	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692850788/teyvatdle/character/fontaine/lynette/talent/rapid_ritesword.png
427	Enigmatic Feint	74	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692850821/teyvatdle/character/fontaine/lynette/talent/enigmatic_feint.png
428	Magic Trick: Astonishing Shift	74	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692850869/teyvatdle/character/fontaine/lynette/talent/magic_trick_astonishing_shift.png
429	Sophisticated Synergy	74	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692850904/teyvatdle/character/fontaine/lynette/talent/sophisticated_synergy.png
430	Props Positively Prepped	74	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692850931/teyvatdle/character/fontaine/lynette/talent/props_positively_prepped.png
431	Loci-Based Mnemonics	74	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692850964/teyvatdle/character/fontaine/lynette/talent/loci-based_mnemonics.png
432	Card Force Translocation	75	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851284/teyvatdle/character/fontaine/lyney/talent/card_force_translocation.png
433	Bewildering Lights	75	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851310/teyvatdle/character/fontaine/lyney/talent/bewildering_lights.png
434	Wondrous Trick: Miracle Parade	75	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851332/teyvatdle/character/fontaine/lyney/talent/wondrous_trick_miracle_parade.png
435	Perilous Performance	75	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851362/teyvatdle/character/fontaine/lyney/talent/perilous_performance.png
436	Conclusive Ovation	75	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851383/teyvatdle/character/fontaine/lyney/talent/conclusive_ovation.png
437	Trivial Observations	75	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692851402/teyvatdle/character/fontaine/lyney/talent/trivial_observations.png
438	Foreign Stream	78	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852851/teyvatdle/character/other/traveler_hydro/talent/foreign_stream.png
439	Aquacrest Saber	78	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852884/teyvatdle/character/other/traveler_hydro/talent/aquacrest_saber.png
440	Rising Waters	78	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852943/teyvatdle/character/other/traveler_hydro/talent/rising_waters.png
441	Spotless Waters	78	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852971/teyvatdle/character/other/traveler_hydro/talent/spotless_waters.png
442	Clear Waters	78	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692852993/teyvatdle/character/other/traveler_hydro/talent/clear_waters.png
443	Flowing Eddies	81	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147021/teyvatdle/character/fontaine/freminet/talent/flowing_eddies.png
444	Pressurized Floe	81	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147044/teyvatdle/character/fontaine/freminet/talent/pressurized_floe.png
445	Shadowhunter's Ambush	81	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147065/teyvatdle/character/fontaine/freminet/talent/shadowhunters_ambush.png
446	Saturation Deep Dive	81	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147086/teyvatdle/character/fontaine/freminet/talent/saturation_deep_dive.png
447	Parallel Condensers	81	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147109/teyvatdle/character/fontaine/freminet/talent/parallel_condensers.png
448	Deepwater Navigation	81	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1694147128/teyvatdle/character/fontaine/freminet/talent/deepwater_navigation.png
449	As Water Seeks Equilibrium	82	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696742892/teyvatdle/character/fontaine/neuvillette/talent/as_water_seeks_equilibrium.png
450	O Tears, I Shall Repay	82	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696742932/teyvatdle/character/fontaine/neuvillette/talent/o_tears_i_shall_repay.png
451	O Tides, I Have Returned	82	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696742982/teyvatdle/character/fontaine/neuvillette/talent/o_tides_i_have_returned.png
452	Heir to the Ancient Sea's Authority	82	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743028/teyvatdle/character/fontaine/neuvillette/talent/heir_to_the_ancient_seas_authority.png
453	Discipline of the Supreme Arbitration	82	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743084/teyvatdle/character/fontaine/neuvillette/talent/discipline_of_the_supreme_arbitration.png
454	Gather Like the Tide	82	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696743138/teyvatdle/character/fontaine/neuvillette/talent/gather_like_the_tide.png
455	Forceful Fists of Frost	83	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862676/teyvatdle/character/fontaine/wriothesley/talent/forceful_fists_of_frost.png
456	Icefang Rush	83	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862714/teyvatdle/character/fontaine/wriothesley/talent/icefang_rush.png
457	Darkgold Wolfbite	83	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862763/teyvatdle/character/fontaine/wriothesley/talent/darkgold_wolfbite.png
458	There Shall Be a Plea for Justice	83	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862796/teyvatdle/character/fontaine/wriothesley/talent/there_shall_be_a_plea_for_justice.png
459	There Shall Be a Reckoning for Sin	83	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862847/teyvatdle/character/fontaine/wriothesley/talent/there_shall_be_a_reckoning_for_sin.png
460	The Duke's Grace	83	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697862908/teyvatdle/character/fontaine/wriothesley/talent/the_dukes_grace.png
461	Soloist's Solicitation	84	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498545/teyvatdle/character/fontaine/furina/talent/soloists_solicitation.png
462	Salon Solitaire	84	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498597/teyvatdle/character/fontaine/furina/talent/salon_solitaire.png
463	Let the People Rejoice	84	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498661/teyvatdle/character/fontaine/furina/talent/let_the_people_rejoice.png
464	Endless Waltz	84	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498703/teyvatdle/character/fontaine/furina/talent/endless_waltz.png
465	Unheard Confession	84	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498752/teyvatdle/character/fontaine/furina/talent/unheard_confession.png
466	The Sea Is My Stage	84	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498802/teyvatdle/character/fontaine/furina/talent/the_sea_is_my_stage.png
467	Cool-Color Capture	85	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498945/teyvatdle/character/fontaine/charlotte/talent/cool-color_capture.png
468	Framing: Freezing Point Composition	85	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701498979/teyvatdle/character/fontaine/charlotte/talent/framing_freezing_point_composition.png
469	Still Photo: Comprehensive Confirmation	85	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499042/teyvatdle/character/fontaine/charlotte/talent/still_photo_comprehensive_confirmation.png
470	Moment of Impact	85	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499092/teyvatdle/character/fontaine/charlotte/talent/moment_of_impact.png
471	Diversified Investigation	85	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499135/teyvatdle/character/fontaine/charlotte/talent/diversified_investigation.png
472	First-Person Shutter	85	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701499191/teyvatdle/character/fontaine/charlotte/talent/first-person_shutter.png
473	Blunt Refusal	86	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214185/teyvatdle/character/fontaine/navia/talent/blunt_refusal.png
474	Ceremonial Crystalshot	86	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214242/teyvatdle/character/fontaine/navia/talent/ceremonial_crystalshot.png
475	As the Sunlit Sky's Singing Salute	86	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214290/teyvatdle/character/fontaine/navia/talent/as_the_sunlit_skys_singing_salute.png
476	Undisclosed Distribution Channels	86	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214354/teyvatdle/character/fontaine/navia/talent/undisclosed_distribution_channels.png
477	Mutual Assistance Network	86	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214391/teyvatdle/character/fontaine/navia/talent/mutual_assistance_network.png
478	Painstaking Transaction	86	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214431/teyvatdle/character/fontaine/navia/talent/painstaking_transaction.png
479	Line Bayonet Thrust EX	87	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214536/teyvatdle/character/fontaine/chevreuse/talent/line_bayonet_thrust_ex.png
480	Short-Range Rapid Interdiction Fire	87	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214573/teyvatdle/character/fontaine/chevreuse/talent/short-range_rapid_interdiction_fire.png
481	Ring of Bursting Grenades	87	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214619/teyvatdle/character/fontaine/chevreuse/talent/ring_of_bursting_grenades.png
482	Vanguard's Coordinated Tactics	87	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214675/teyvatdle/character/fontaine/chevreuse/talent/vanguards_coordinated_tactics.png
483	Vertical Force Coordination	87	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214728/teyvatdle/character/fontaine/chevreuse/talent/vertical_force_coordination.png
484	Double Time March	87	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705214765/teyvatdle/character/fontaine/chevreuse/talent/double_time_march.png
485	Word of Wind and Flower	88	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707633568/teyvatdle/character/liyue/xianyun/talent/word_of_wind_and_flower.png
486	White Clouds at Dawn	88	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707633609/teyvatdle/character/liyue/xianyun/talent/white_clouds_at_dawn.png
487	Stars Gather at Dusk	88	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707633679/teyvatdle/character/liyue/xianyun/talent/stars_gather_at_dusk.png
488	Galefeather Pursuit	88	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707633726/teyvatdle/character/liyue/xianyun/talent/galefeather_pursuit.png
489	Consider, the Adeptus in Her Realm	88	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707633760/teyvatdle/character/liyue/xianyun/talent/consider_the_adeptus_in_her_realm.png
490	Crane Form	88	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707633806/teyvatdle/character/liyue/xianyun/talent/crane_form.png
491	Stellar Rend	89	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707633936/teyvatdle/character/liyue/gaming/talent/stellar_rend.png
492	Bestial Ascent	89	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707633976/teyvatdle/character/liyue/gaming/talent/bestial_ascent.png
493	Suanni's Gilded Dance	89	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634013/teyvatdle/character/liyue/gaming/talent/suannis_gilded_dance.png
494	Dance of Amity	89	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634057/teyvatdle/character/liyue/gaming/talent/dance_of_amity.png
495	Air of Prosperity	89	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634091/teyvatdle/character/liyue/gaming/talent/air_of_prosperity.png
496	The Striding Beast	89	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707634161/teyvatdle/character/liyue/gaming/talent/the_striding_beast.png
497	Weaving Blade	90	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258607/teyvatdle/character/inazuma/chiori/talent/weaving_blade.png
498	Fluttering Hasode	90	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258659/teyvatdle/character/inazuma/chiori/talent/fluttering_hasode.png
499	Hiyoku: Twin Blades	90	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258710/teyvatdle/character/inazuma/chiori/talent/hiyoku_twin_blades.png
500	Tailor-Made	90	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258780/teyvatdle/character/inazuma/chiori/talent/tailor-made.png
501	The Finishing Touch	90	6	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258822/teyvatdle/character/inazuma/chiori/talent/the_finishing_touch.png
502	Brocaded Collar's Beauteous Silhouette	90	7	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711258900/teyvatdle/character/inazuma/chiori/talent/brocaded_collars_beauteous_silhouette.png
\.


--
-- TOC entry 3984 (class 0 OID 28586)
-- Dependencies: 272
-- Data for Name: talent_book; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.talent_book (id, name, image_url) FROM stdin;
1	Freedom	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689569452/teyvatdle/talent_book/freedom.png
2	Resistance	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689569562/teyvatdle/talent_book/resistance.png
3	Ballad	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689569632/teyvatdle/talent_book/ballad.png
4	Prosperity	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689569716/teyvatdle/talent_book/prosperity.png
5	Diligence	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689569819/teyvatdle/talent_book/diligence.png
6	Gold	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689569922/teyvatdle/talent_book/gold.png
7	Transience	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689570039/teyvatdle/talent_book/transience.png
8	Elegance	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689570114/teyvatdle/talent_book/elegance.png
9	Light	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689570213/teyvatdle/talent_book/light.png
10	Admonition	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689570317/teyvatdle/talent_book/admonition.png
11	Ingenuity	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689570445/teyvatdle/talent_book/ingenuity.png
12	Praxis	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689570576/teyvatdle/talent_book/praxis.png
13	Equity	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692677444/teyvatdle/talent_book/equity.png
14	Justice	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692677609/teyvatdle/talent_book/justice.png
15	Order	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692677706/teyvatdle/talent_book/order.png
\.


--
-- TOC entry 4011 (class 0 OID 28844)
-- Dependencies: 299
-- Data for Name: talent_type; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.talent_type (id, name) FROM stdin;
1	Normal Attack
2	Elemental Skill
3	Alternate Sprint
4	Elemental Burst
5	1st Ascension Passive
6	4th Ascension Passive
7	Utility Passive
8	Passive
\.


--
-- TOC entry 3999 (class 0 OID 28694)
-- Dependencies: 287
-- Data for Name: weapon; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.weapon (id, name, rarity, type_id, sub_stat_id, weapon_domain_material_id, elite_enemy_material_id, common_enemy_material_id, gacha, image_url) FROM stdin;
105	Sacrificial Bow	4	5	10	2	13	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003793/teyvatdle/weapon/bow/sacrificial_bow.png
25	Primordial Jade Winged-Spear	5	3	4	4	16	5	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000626/teyvatdle/weapon/polearm/primordial_jade_winged-spear.png
80	Lithic Blade	4	2	2	4	16	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999750/teyvatdle/weapon/claymore/lithic_blade.png
14	Haran Geppaku Futsu	5	1	4	8	21	8	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689997790/teyvatdle/weapon/sword/haran_geppaku_futsu.png
22	Mistsplitter Reforged	5	1	3	7	18	8	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689997974/teyvatdle/weapon/sword/mistsplitter_reforged.png
28	Skyward Blade	5	1	10	2	13	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998051/teyvatdle/weapon/sword/skyward_blade.png
47	Blackcliff Longsword	4	1	3	4	16	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998191/teyvatdle/weapon/sword/blackcliff_longsword.png
64	Favonius Sword	4	1	10	1	12	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998295/teyvatdle/weapon/sword/favonius_sword.png
74	Iron Sting	4	1	9	6	17	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998361/teyvatdle/weapon/sword/iron_sting.png
95	Prototype Rancour	4	1	15	5	15	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998491/teyvatdle/weapon/sword/prototype_rancour.png
26	Redhorn Stonethresher	5	2	3	8	20	8	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999379/teyvatdle/weapon/claymore/redhorn_stonethresher.png
32	Song of Broken Pines	5	2	15	1	12	2	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999447/teyvatdle/weapon/claymore/song_of_broken_pines.png
43	Akuoumaru	4	2	2	7	20	8	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999564/teyvatdle/weapon/claymore/akuoumaru.png
62	Favonius Greatsword	4	2	10	3	14	5	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999646/teyvatdle/weapon/claymore/favonius_greatsword.png
83	Mailed Flower	4	2	9	3	25	9	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999824/teyvatdle/weapon/claymore/mailed_flower.png
98	Rainslasher	4	2	9	5	15	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999986/teyvatdle/weapon/claymore/rainslasher.png
107	Sacrificial Greatsword	4	2	10	2	13	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000081/teyvatdle/weapon/claymore/sacrificial_greatsword.png
33	Staff of Homa	5	3	3	6	13	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000709/teyvatdle/weapon/polearm/staff_of_homa.png
42	"The Catch"	4	3	10	9	18	9	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000833/teyvatdle/weapon/polearm/the_catch.png
53	Crescent Pike	4	3	15	4	16	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000901/teyvatdle/weapon/polearm/crescent_pike.png
57	Dragonspine Spear	4	3	15	2	15	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001005/teyvatdle/weapon/polearm/dragonspine_spear.png
78	Kitain Cross Spear	4	3	9	9	18	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001073/teyvatdle/weapon/polearm/kitain_cross_spear.png
88	Moonpiercer	4	3	9	11	23	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001221/teyvatdle/weapon/polearm/moonpiercer.png
103	Royal Spear	4	3	2	5	15	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001297/teyvatdle/weapon/polearm/royal_spear.png
16	Jadefall's Splendor	5	4	13	4	26	10	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001681/teyvatdle/weapon/catalyst/jadefalls_splendor.png
20	Lost Prayer to the Sacred Winds	5	4	4	3	14	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001761/teyvatdle/weapon/catalyst/lost_prayer_to_the_sacred_winds.png
38	Tulaytullah's Remembrance	5	4	3	12	22	10	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001920/teyvatdle/weapon/catalyst/tulaytullahs_remembrance.png
59	Eye of Perception	4	4	2	5	15	2	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002054/teyvatdle/weapon/catalyst/eye_of_perception.png
68	Frostbearer	4	4	2	3	14	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002125/teyvatdle/weapon/catalyst/frostbearer.png
71	Hakushin Ring	4	4	10	7	19	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002195/teyvatdle/weapon/catalyst/hakushin_ring.png
92	Prototype Amber	4	4	13	5	15	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002305/teyvatdle/weapon/catalyst/prototype_amber.png
2	Amos' Bow	5	5	2	3	14	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002865/teyvatdle/weapon/bow/amos_bow.png
10	Elegy for the End	5	5	10	2	12	5	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002950/teyvatdle/weapon/bow/elegy_for_the_end.png
23	Polar Star	5	5	4	9	20	9	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003028/teyvatdle/weapon/bow/polar_star.png
44	Alley Hunter	4	5	2	3	14	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003132/teyvatdle/weapon/bow/alley_hunter.png
52	Compound Bow	4	5	15	6	17	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003210/teyvatdle/weapon/bow/compound_bow.png
65	Favonius Warbow	4	5	10	3	14	7	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003311/teyvatdle/weapon/bow/favonius_warbow.png
73	Ibis Piercer	4	5	2	10	26	11	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003400/teyvatdle/weapon/bow/ibis_piercer.png
89	Mouun's Moon	4	5	2	8	19	9	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003519/teyvatdle/weapon/bow/mouuns_moon.png
94	Prototype Crescent	4	5	2	5	15	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003613/teyvatdle/weapon/bow/prototype_crescent.png
125	Windblume Ode	4	5	9	3	13	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003891/teyvatdle/weapon/bow/windblume_ode.png
141	Raven Bow	3	5	9	1	12	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690004017/teyvatdle/weapon/bow/raven_bow.png
146	Slingshot	3	5	4	4	16	2	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690004123/teyvatdle/weapon/bow/slingshot.png
163	Hunter's Bow	1	5	\N	2	13	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690004209/teyvatdle/weapon/bow/hunters_bow.png
5	Aquila Favonia	5	1	15	1	12	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689997690/teyvatdle/weapon/sword/aquila_favonia.png
13	Freedom-Sworn	5	1	9	3	14	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689997748/teyvatdle/weapon/sword/freedom-sworn.png
18	Key of Khaj-Nisut	5	1	13	10	24	11	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689997844/teyvatdle/weapon/sword/key_of_khaj-nisut.png
19	Light of Foliar Incision	5	1	3	10	25	11	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689997890/teyvatdle/weapon/sword/light_of_foliar_incision.png
24	Primordial Jade Cutter	5	1	4	5	15	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998014/teyvatdle/weapon/sword/primordial_jade_cutter.png
35	Summit Shaper	5	1	2	4	16	2	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998088/teyvatdle/weapon/sword/summit_shaper.png
45	Amenoma Kageuchi	4	1	2	7	18	8	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998149/teyvatdle/weapon/sword/amenoma_kageuchi.png
51	Cinnabar Spindle	4	1	6	1	14	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998253/teyvatdle/weapon/sword/cinnabar_spindle.png
66	Festering Desire	4	1	10	3	12	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998328/teyvatdle/weapon/sword/festering_desire.png
75	Kagotsurube Isshin	4	1	2	9	21	9	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998406/teyvatdle/weapon/sword/kagotsurube_isshin.png
79	Lion's Roar	4	1	2	4	16	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998451/teyvatdle/weapon/sword/lions_roar.png
102	Royal Longsword	4	1	2	1	12	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998529/teyvatdle/weapon/sword/royal_longsword.png
108	Sacrificial Sword	4	1	10	3	14	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998589/teyvatdle/weapon/sword/sacrificial_sword.png
109	Sapwood Blade	4	1	10	10	23	11	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998636/teyvatdle/weapon/sword/sapwood_blade.png
113	Sword of Descension	4	1	2	2	13	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998689/teyvatdle/weapon/sword/sword_of_descension.png
114	The Alley Flash	4	1	9	1	12	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998740/teyvatdle/weapon/sword/the_alley_flash.png
116	The Black Sword	4	1	4	2	13	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998778/teyvatdle/weapon/sword/the_black_sword.png
117	The Flute	4	1	2	2	13	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998817/teyvatdle/weapon/sword/the_flute.png
121	Toukabou Shigure	4	1	9	8	24	8	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998856/teyvatdle/weapon/sword/toukabou_shigure.png
127	Xiphos' Moonlight	4	1	9	10	24	11	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998894/teyvatdle/weapon/sword/xiphos_moonlight.png
130	Cool Steel	3	1	2	1	12	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998942/teyvatdle/weapon/sword/cool_steel.png
131	Dark Iron Sword	3	1	9	4	16	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689998975/teyvatdle/weapon/sword/dark_iron_sword.png
135	Fillet Blade	3	1	2	5	15	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999010/teyvatdle/weapon/sword/fillet_blade.png
137	Harbinger of Dawn	3	1	3	2	13	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999043/teyvatdle/weapon/sword/harbinger_of_dawn.png
148	Traveler's Handy Sword	3	1	6	3	14	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999185/teyvatdle/weapon/sword/travelers_handy_sword.png
110	Serpent Spine	4	2	4	6	17	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000125/teyvatdle/weapon/claymore/serpent_spine.png
115	The Bell	4	2	13	1	12	7	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000218/teyvatdle/weapon/claymore/the_bell.png
132	Debate Club	3	2	2	5	15	2	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000323/teyvatdle/weapon/claymore/debate_club.png
144	Skyrider Greatsword	3	2	15	6	17	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000384/teyvatdle/weapon/claymore/skyrider_greatsword.png
164	Waster Greatsword	1	2	\N	2	13	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000493/teyvatdle/weapon/claymore/waster_greatsword.png
128	Black Tassel	3	3	13	6	17	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001376/teyvatdle/weapon/polearm/black_tassel.png
152	Iron Point	2	3	\N	3	14	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001475/teyvatdle/weapon/polearm/iron_point.png
112	Solar Pearl	4	4	4	4	16	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002439/teyvatdle/weapon/catalyst/solar_pearl.png
126	Wine and Song	4	4	10	2	13	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002543/teyvatdle/weapon/catalyst/wine_and_song.png
138	Magic Guide	3	4	9	1	12	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002630/teyvatdle/weapon/catalyst/magic_guide.png
149	Twin Nephrite	3	4	4	5	15	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002739/teyvatdle/weapon/catalyst/twin_nephrite.png
160	Apprentice's Notes	1	4	\N	1	12	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002809/teyvatdle/weapon/catalyst/apprentices_notes.png
145	Skyrider Sword	3	1	10	6	17	5	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999146/teyvatdle/weapon/sword/skyrider_sword.png
159	Silver Sword	2	1	\N	1	12	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999222/teyvatdle/weapon/sword/silver_sword.png
162	Dull Blade	1	1	\N	1	12	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999276/teyvatdle/weapon/sword/dull_blade.png
6	Beacon of the Reed Sea	5	2	4	12	25	11	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999332/teyvatdle/weapon/claymore/beacon_of_the_reed_sea.png
30	Skyward Pride	5	2	10	2	13	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999413/teyvatdle/weapon/claymore/skyward_pride.png
36	The Unforged	5	2	2	5	15	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999492/teyvatdle/weapon/claymore/the_unforged.png
41	Wolf's Gravestone	5	2	2	3	14	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999533/teyvatdle/weapon/claymore/wolfs_gravestone.png
49	Blackcliff Slasher	4	2	3	5	15	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999609/teyvatdle/weapon/claymore/blackcliff_slasher.png
67	Forest Regalia	4	2	10	10	23	11	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999682/teyvatdle/weapon/claymore/forest_regalia.png
76	Katsuragikiri Nagamasa	4	2	10	8	18	8	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999716/teyvatdle/weapon/claymore/katsuragikiri_nagamasa.png
82	Luxurious Sea-Lord	4	2	2	6	17	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999784/teyvatdle/weapon/claymore/luxurious_sea-lord.png
84	Makhaira Aquamarine	4	2	9	12	23	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999865/teyvatdle/weapon/claymore/makhaira_aquamarine.png
93	Prototype Archaic	4	2	2	6	17	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689999896/teyvatdle/weapon/claymore/prototype_archaic.png
100	Royal Greatsword	4	2	2	3	14	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000021/teyvatdle/weapon/claymore/royal_greatsword.png
111	Snow-Tombed Starsilver	4	2	15	1	12	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000181/teyvatdle/weapon/claymore/snow-tombed_starsilver.png
124	Whiteblind	4	2	6	4	16	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000250/teyvatdle/weapon/claymore/whiteblind.png
129	Bloodtainted Greatsword	3	2	9	2	13	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000283/teyvatdle/weapon/claymore/bloodtainted_greatsword.png
134	Ferrous Shadow	3	2	13	1	12	7	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000354/teyvatdle/weapon/claymore/ferrous_shadow.png
150	White Iron Greatsword	3	2	6	3	14	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000420/teyvatdle/weapon/claymore/white_iron_greatsword.png
153	Old Merc's Pal	2	2	\N	2	13	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000457/teyvatdle/weapon/claymore/old_mercs_pal.png
9	Calamity Queller	5	3	2	5	15	7	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000551/teyvatdle/weapon/polearm/calamity_queller.png
11	Engulfing Lightning	5	3	10	9	18	8	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000592/teyvatdle/weapon/polearm/engulfing_lightning.png
31	Skyward Spine	5	3	10	3	14	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000674/teyvatdle/weapon/polearm/skyward_spine.png
34	Staff of the Scarlet Sands	5	3	4	11	23	10	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000747/teyvatdle/weapon/polearm/staff_of_the_scarlet_sands.png
40	Vortex Vanquisher	5	3	2	6	17	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000800/teyvatdle/weapon/polearm/vortex_vanquisher.png
48	Blackcliff Pole	4	3	3	5	15	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000864/teyvatdle/weapon/polearm/blackcliff_pole.png
54	Deathmatch	4	3	4	2	13	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000930/teyvatdle/weapon/polearm/deathmatch.png
56	Dragon's Bane	4	3	9	5	15	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690000965/teyvatdle/weapon/polearm/dragons_bane.png
63	Favonius Lance	4	3	10	3	14	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001038/teyvatdle/weapon/polearm/favonius_lance.png
81	Lithic Spear	4	3	2	6	17	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001106/teyvatdle/weapon/polearm/lithic_spear.png
86	Missive Windspear	4	3	2	2	21	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001181/teyvatdle/weapon/polearm/missive_windspear.png
97	Prototype Starglitter	4	3	10	6	17	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001266/teyvatdle/weapon/polearm/prototype_starglitter.png
123	Wavebreaker's Fin	4	3	2	9	20	8	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001338/teyvatdle/weapon/polearm/wavebreakers_fin.png
136	Halberd	3	3	2	5	15	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001408/teyvatdle/weapon/polearm/halberd.png
151	White Tassel	3	3	4	4	16	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001440/teyvatdle/weapon/polearm/white_tassel.png
161	Beginner's Protector	1	3	\N	3	14	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001528/teyvatdle/weapon/polearm/beginners_protector.png
1	A Thousand Floating Dreams	5	4	9	11	24	10	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001573/teyvatdle/weapon/catalyst/a_thousand_floating_dreams.png
12	Everlasting Moonglow	5	4	13	7	19	9	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001623/teyvatdle/weapon/catalyst/everlasting_moonglow.png
17	Kagura's Verity	5	4	3	9	20	9	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001725/teyvatdle/weapon/catalyst/kaguras_verity.png
21	Memory of Dust	5	4	2	6	17	2	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001845/teyvatdle/weapon/catalyst/memory_of_dust.png
27	Skyward Atlas	5	4	2	2	13	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001881/teyvatdle/weapon/catalyst/skyward_atlas.png
46	Blackcliff Agate	4	4	3	4	16	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690001956/teyvatdle/weapon/catalyst/blackcliff_agate.png
55	Dodoco Tales	4	4	2	2	13	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002015/teyvatdle/weapon/catalyst/dodoco_tales.png
61	Favonius Codex	4	4	10	1	12	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002091/teyvatdle/weapon/catalyst/favonius_codex.png
70	Fruit of Fulfillment	4	4	10	11	21	10	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002157/teyvatdle/weapon/catalyst/fruit_of_fulfillment.png
85	Mappa Mare	4	4	9	6	17	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002235/teyvatdle/weapon/catalyst/mappa_mare.png
90	Oathsworn Eye	4	4	2	7	20	9	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002271/teyvatdle/weapon/catalyst/oathsworn_eye.png
101	Royal Grimoire	4	4	2	1	12	5	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002339/teyvatdle/weapon/catalyst/royal_grimoire.png
106	Sacrificial Fragments	4	4	9	3	14	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002395/teyvatdle/weapon/catalyst/sacrificial_fragments.png
120	The Widsith	4	4	3	2	13	2	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002474/teyvatdle/weapon/catalyst/the_widsith.png
122	Wandering Evenstar	4	4	9	11	22	10	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002509/teyvatdle/weapon/catalyst/wandering_evenstar.png
133	Emerald Orb	3	4	9	4	16	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002597/teyvatdle/weapon/catalyst/emerald_orb.png
140	Otherworldly Story	3	4	10	3	14	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002661/teyvatdle/weapon/catalyst/otherworldly_story.png
147	Thrilling Tales of Dragon Slayers	3	4	13	2	13	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002695/teyvatdle/weapon/catalyst/thrilling_tales_of_dragon_slayers.png
157	Pocket Grimoire	2	4	\N	1	12	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002774/teyvatdle/weapon/catalyst/pocket_grimoire.png
4	Aqua Simulacra	5	5	3	4	21	9	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002902/teyvatdle/weapon/bow/aqua_simulacra.png
15	Hunter's Path	5	5	4	12	22	11	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690002991/teyvatdle/weapon/bow/hunters_path.png
29	Skyward Harp	5	5	4	2	13	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003061/teyvatdle/weapon/bow/skyward_harp.png
37	Thundering Pulse	5	5	3	8	19	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003096/teyvatdle/weapon/bow/thundering_pulse.png
50	Blackcliff Warbow	4	5	3	4	16	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003172/teyvatdle/weapon/bow/blackcliff_warbow.png
58	End of the Line	4	5	10	12	22	10	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003243/teyvatdle/weapon/bow/end_of_the_line.png
60	Fading Twilight	4	5	10	6	16	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003279/teyvatdle/weapon/bow/fading_twilight.png
72	Hamayumi	4	5	2	8	19	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003365/teyvatdle/weapon/bow/hamayumi.png
77	King's Squire	4	5	2	12	22	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003447/teyvatdle/weapon/bow/kings_squire.png
87	Mitternachts Waltz	4	5	15	1	12	6	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003484/teyvatdle/weapon/bow/mitternachts_waltz.png
91	Predator	4	5	2	8	19	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003565/teyvatdle/weapon/bow/predator.png
99	Royal Bow	4	5	2	3	14	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003676/teyvatdle/weapon/bow/royal_bow.png
104	Rust	4	5	2	4	16	2	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003721/teyvatdle/weapon/bow/rust.png
118	The Stringless	4	5	9	1	12	4	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003827/teyvatdle/weapon/bow/the_stringless.png
119	The Viridescent Hunt	4	5	4	1	12	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003867/teyvatdle/weapon/bow/the_viridescent_hunt.png
139	Messenger	3	5	3	5	15	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690003982/teyvatdle/weapon/bow/messenger.png
142	Recurve Bow	3	5	13	3	14	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690004052/teyvatdle/weapon/bow/recurve_bow.png
143	Sharpshooter's Oath	3	5	3	2	13	1	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690004091/teyvatdle/weapon/bow/sharpshooters_oath.png
158	Seasoned Hunter's Bow	2	5	\N	2	13	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1690004162/teyvatdle/weapon/bow/seasoned_hunters_bow.png
174	The First Great Magic	5	5	3	13	81	79	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692765772/teyvatdle/weapon/bow/the_first_great_magic.png
175	Song of Stillness	4	5	2	13	81	4	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766028/teyvatdle/weapon/bow/song_of_stillness.png
176	Finale of the Deep	4	1	2	14	81	8	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766057/teyvatdle/weapon/sword/finale_of_the_deep.png
177	Tidal Shadow	4	2	2	15	82	80	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766086/teyvatdle/weapon/claymore/tidal_shadow.png
178	Rightful Reward	4	3	13	15	82	80	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766125/teyvatdle/weapon/polearm/rightful_reward.png
179	Flowing Purity	4	4	2	14	82	79	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766171/teyvatdle/weapon/catalyst/flowing_purity.png
180	Scion of the Blazing Sun	4	5	4	12	26	10	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766203/teyvatdle/weapon/bow/scion_of_the_blazing_sun.png
181	Wolf-Fang	4	1	4	1	14	2	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766231/teyvatdle/weapon/sword/wolf-fang.png
182	Talking Stick	4	2	4	11	25	1	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766260/teyvatdle/weapon/claymore/talking_stick.png
183	Ballad of the Fjords	4	3	4	15	26	7	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766284/teyvatdle/weapon/polearm/ballad_of_the_fjords.png
184	Sacrificial Jade	4	4	4	4	15	3	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692766333/teyvatdle/weapon/catalyst/sacrificial_jade.png
185	Fleuve Cendre Ferryman	4	1	10	13	81	79	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696742122/teyvatdle/weapon/sword/fleuve_cendre_ferryman.png
186	Tome of the Eternal Flow	5	4	3	14	82	80	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1696742207/teyvatdle/weapon/catalyst/tome_of_the_eternal_flow.png
187	Cashflow Supervision	5	4	4	15	83	79	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697860881/teyvatdle/weapon/catalyst/cashflow_supervision.png
188	The Dockhand's Assistant	4	1	13	14	83	79	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697860986/teyvatdle/weapon/sword/the_dockhands_assistant.png
189	Portable Power Saw	4	2	13	15	82	80	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697861072/teyvatdle/weapon/claymore/portable_power_saw.png
190	Prospector's Drill	4	3	2	13	83	80	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697861211/teyvatdle/weapon/polearm/prospectors_drill.png
191	Range Gauge	4	5	2	13	81	79	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697861309/teyvatdle/weapon/bow/range_gauge.png
192	Ballad of the Boundless Blue	4	4	10	2	17	6	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1697861398/teyvatdle/weapon/catalyst/ballad_of_the_boundless_blue.png
193	Splendor of Tranquil Waters	5	1	3	14	81	79	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701497263/teyvatdle/weapon/sword/splendor_of_tranquil_waters.png
194	Sword of Narzissenkreuz	4	1	2	13	83	79	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1701497348/teyvatdle/weapon/sword/sword_of_narzissenkreuz.png
195	Verdict	5	2	4	13	82	80	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705212740/teyvatdle/weapon/claymore/verdict.png
196	"Ultimate Overlord's Mega Magic Sword"	4	2	10	15	83	80	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1705212889/teyvatdle/weapon/claymore/ultimate_overlords_mega_magic_sword.png
197	Crane's Echoing Call	5	4	2	5	84	3	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1707632391/teyvatdle/weapon/catalyst/cranes_echoing_call.png
198	Uraku Misugiri	5	1	3	7	18	8	t	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711257721/teyvatdle/weapon/sword/uraku_misugiri.png
199	Dialogues of the Desert Sages	4	3	13	10	84	9	f	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1711257812/teyvatdle/weapon/polearm/dialogues_of_the_desert_sages.png
\.


--
-- TOC entry 3996 (class 0 OID 28666)
-- Dependencies: 284
-- Data for Name: weapon_domain_material; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.weapon_domain_material (id, name, region_id, image_url) FROM stdin;
1	Decarabian Tiles	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689570806/teyvatdle/weapon_domain_material/decarabian_tiles.png
2	Boreal Wolf Teeth	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689570996/teyvatdle/weapon_domain_material/boreal_wolf_teeth.png
3	Gladiator Shackles	1	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689571259/teyvatdle/weapon_domain_material/gladiator_shackles.png
4	Guyun Pillars	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689571482/teyvatdle/weapon_domain_material/guyun_pillars.png
5	Elixirs	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689571572/teyvatdle/weapon_domain_material/elixirs.png
6	Aerosiderite	2	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689571704/teyvatdle/weapon_domain_material/aerosiderite.png
7	Branches of a Distant Sea	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689657433/teyvatdle/weapon_domain_material/branches_of_a_distant_sea.png
8	Narukami's Magatamas	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689657587/teyvatdle/weapon_domain_material/narukamis_magatamas.png
9	Oni Masks	3	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689657686/teyvatdle/weapon_domain_material/oni_masks.png
10	Talismans of the Forest Dew	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689657784/teyvatdle/weapon_domain_material/talismans_of_the_forest_dew.png
11	Oasis Gardens	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689658155/teyvatdle/weapon_domain_material/oasis_gardens.png
12	Scorching Mights	4	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1689658269/teyvatdle/weapon_domain_material/scorching_mights.png
13	Ancient Chords	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692678074/teyvatdle/weapon_domain_material/ancient_chords.png
14	Sacred Dewdrops	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692678173/teyvatdle/weapon_domain_material/sacred_dewdrops.png
15	Goblets of the Pristine Sea	5	https://res.cloudinary.com/ddwpyixfg/image/upload/q_auto/v1692678288/teyvatdle/weapon_domain_material/goblets_of_the_pristine_sea.png
\.


--
-- TOC entry 3982 (class 0 OID 28577)
-- Dependencies: 270
-- Data for Name: weapon_type; Type: TABLE DATA; Schema: genshin; Owner: postgres
--

COPY genshin.weapon_type (id, name) FROM stdin;
1	Sword
2	Claymore
3	Polearm
4	Catalyst
5	Bow
\.


--
-- TOC entry 4024 (class 0 OID 0)
-- Dependencies: 281
-- Name: boss_drops_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.boss_drops_id_seq', 59, true);


--
-- TOC entry 4025 (class 0 OID 0)
-- Dependencies: 279
-- Name: bosses_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.bosses_id_seq', 39, true);


--
-- TOC entry 4026 (class 0 OID 0)
-- Dependencies: 296
-- Name: character_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.character_id_seq', 90, true);


--
-- TOC entry 4027 (class 0 OID 0)
-- Dependencies: 303
-- Name: constellation_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.constellation_id_seq', 516, true);


--
-- TOC entry 4028 (class 0 OID 0)
-- Dependencies: 306
-- Name: daily_record_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.daily_record_id_seq', 282, true);


--
-- TOC entry 4029 (class 0 OID 0)
-- Dependencies: 288
-- Name: element_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.element_id_seq', 7, true);


--
-- TOC entry 4030 (class 0 OID 0)
-- Dependencies: 277
-- Name: enemy_drops_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.enemy_drops_id_seq', 86, true);


--
-- TOC entry 4031 (class 0 OID 0)
-- Dependencies: 275
-- Name: enemy_families_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.enemy_families_id_seq', 40, true);


--
-- TOC entry 4032 (class 0 OID 0)
-- Dependencies: 294
-- Name: food_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.food_id_seq', 347, true);


--
-- TOC entry 4033 (class 0 OID 0)
-- Dependencies: 292
-- Name: food_type_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.food_type_id_seq', 6, true);


--
-- TOC entry 4034 (class 0 OID 0)
-- Dependencies: 290
-- Name: local_specialty_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.local_specialty_id_seq', 46, true);


--
-- TOC entry 4035 (class 0 OID 0)
-- Dependencies: 268
-- Name: regions_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.regions_id_seq', 7, true);


--
-- TOC entry 4036 (class 0 OID 0)
-- Dependencies: 273
-- Name: stats_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.stats_id_seq', 16, true);


--
-- TOC entry 4037 (class 0 OID 0)
-- Dependencies: 271
-- Name: talent_books_ud_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.talent_books_ud_seq', 15, true);


--
-- TOC entry 4038 (class 0 OID 0)
-- Dependencies: 301
-- Name: talent_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.talent_id_seq', 502, true);


--
-- TOC entry 4039 (class 0 OID 0)
-- Dependencies: 298
-- Name: talent_type_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.talent_type_id_seq', 8, true);


--
-- TOC entry 4040 (class 0 OID 0)
-- Dependencies: 283
-- Name: weapon_domain_materials_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.weapon_domain_materials_id_seq', 15, true);


--
-- TOC entry 4041 (class 0 OID 0)
-- Dependencies: 286
-- Name: weapon_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.weapon_id_seq', 199, true);


--
-- TOC entry 4042 (class 0 OID 0)
-- Dependencies: 269
-- Name: weapon_types_id_seq; Type: SEQUENCE SET; Schema: genshin; Owner: postgres
--

SELECT pg_catalog.setval('genshin.weapon_types_id_seq', 5, true);


--
-- TOC entry 3731 (class 2606 OID 28659)
-- Name: boss_drop boss_drops_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.boss_drop
    ADD CONSTRAINT boss_drops_pkey PRIMARY KEY (id);


--
-- TOC entry 3728 (class 2606 OID 28645)
-- Name: boss bosses_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.boss
    ADD CONSTRAINT bosses_pkey PRIMARY KEY (id);


--
-- TOC entry 3751 (class 2606 OID 28794)
-- Name: character character_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT character_pkey PRIMARY KEY (id);


--
-- TOC entry 3760 (class 2606 OID 28896)
-- Name: constellation constellation_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.constellation
    ADD CONSTRAINT constellation_pkey PRIMARY KEY (id);


--
-- TOC entry 3702 (class 2606 OID 29036)
-- Name: character correct_image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin."character"
    ADD CONSTRAINT correct_image_url_contains_q_auto CHECK ((correct_image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3762 (class 2606 OID 28926)
-- Name: daily_record daily_record_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.daily_record
    ADD CONSTRAINT daily_record_pkey PRIMARY KEY (id);


--
-- TOC entry 3739 (class 2606 OID 28742)
-- Name: element element_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.element
    ADD CONSTRAINT element_pkey PRIMARY KEY (id);


--
-- TOC entry 3724 (class 2606 OID 28635)
-- Name: enemy_drop enemy_drops_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.enemy_drop
    ADD CONSTRAINT enemy_drops_pkey PRIMARY KEY (id);


--
-- TOC entry 3721 (class 2606 OID 28625)
-- Name: enemy_family enemy_families_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.enemy_family
    ADD CONSTRAINT enemy_families_pkey PRIMARY KEY (id);


--
-- TOC entry 3748 (class 2606 OID 28778)
-- Name: food food_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (id);


--
-- TOC entry 3745 (class 2606 OID 28769)
-- Name: food_type food_type_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.food_type
    ADD CONSTRAINT food_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3697 (class 2606 OID 28990)
-- Name: boss_drop image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.boss_drop
    ADD CONSTRAINT image_url_contains_q_auto CHECK ((image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3693 (class 2606 OID 28991)
-- Name: talent_book image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.talent_book
    ADD CONSTRAINT image_url_contains_q_auto CHECK ((image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3698 (class 2606 OID 28995)
-- Name: weapon_domain_material image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.weapon_domain_material
    ADD CONSTRAINT image_url_contains_q_auto CHECK ((image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3703 (class 2606 OID 28996)
-- Name: character image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin."character"
    ADD CONSTRAINT image_url_contains_q_auto CHECK ((image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3695 (class 2606 OID 28997)
-- Name: enemy_drop image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.enemy_drop
    ADD CONSTRAINT image_url_contains_q_auto CHECK ((image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3701 (class 2606 OID 28998)
-- Name: food image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.food
    ADD CONSTRAINT image_url_contains_q_auto CHECK ((image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3700 (class 2606 OID 28999)
-- Name: local_specialty image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.local_specialty
    ADD CONSTRAINT image_url_contains_q_auto CHECK ((image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3699 (class 2606 OID 29000)
-- Name: weapon image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.weapon
    ADD CONSTRAINT image_url_contains_q_auto CHECK ((image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3742 (class 2606 OID 28755)
-- Name: local_specialty local_specialty_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.local_specialty
    ADD CONSTRAINT local_specialty_pkey PRIMARY KEY (id);


--
-- TOC entry 3709 (class 2606 OID 28567)
-- Name: region regions_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.region
    ADD CONSTRAINT regions_pkey PRIMARY KEY (id);


--
-- TOC entry 3718 (class 2606 OID 28601)
-- Name: stat stats_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.stat
    ADD CONSTRAINT stats_pkey PRIMARY KEY (id);


--
-- TOC entry 3715 (class 2606 OID 28592)
-- Name: talent_book talent_books_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.talent_book
    ADD CONSTRAINT talent_books_pkey PRIMARY KEY (id);


--
-- TOC entry 3757 (class 2606 OID 28872)
-- Name: talent talent_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.talent
    ADD CONSTRAINT talent_pkey PRIMARY KEY (id);


--
-- TOC entry 3754 (class 2606 OID 28850)
-- Name: talent_type talent_type_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.talent_type
    ADD CONSTRAINT talent_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3704 (class 2606 OID 28841)
-- Name: character valid_genders; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin."character"
    ADD CONSTRAINT valid_genders CHECK (((gender)::text = ANY ((ARRAY['Male'::character varying, 'Female'::character varying, 'Other'::character varying])::text[]))) NOT VALID;


--
-- TOC entry 3705 (class 2606 OID 28840)
-- Name: character valid_heights; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin."character"
    ADD CONSTRAINT valid_heights CHECK (((height)::text = ANY ((ARRAY['Short'::character varying, 'Medium'::character varying, 'Tall'::character varying])::text[]))) NOT VALID;


--
-- TOC entry 3734 (class 2606 OID 28672)
-- Name: weapon_domain_material weapon_domain_materials_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon_domain_material
    ADD CONSTRAINT weapon_domain_materials_pkey PRIMARY KEY (id);


--
-- TOC entry 3737 (class 2606 OID 28700)
-- Name: weapon weapon_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon
    ADD CONSTRAINT weapon_pkey PRIMARY KEY (id);


--
-- TOC entry 3712 (class 2606 OID 28583)
-- Name: weapon_type weapon_types_pkey; Type: CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon_type
    ADD CONSTRAINT weapon_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3706 (class 2606 OID 29037)
-- Name: character wrong_image_url_contains_q_auto; Type: CHECK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin."character"
    ADD CONSTRAINT wrong_image_url_contains_q_auto CHECK ((wrong_image_url ~~ '%/upload/q_auto/%'::text)) NOT VALID;


--
-- TOC entry 3725 (class 1259 OID 28651)
-- Name: PK_boss; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_boss" ON genshin.boss USING btree (id);


--
-- TOC entry 3729 (class 1259 OID 28678)
-- Name: PK_boss_drop; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_boss_drop" ON genshin.boss_drop USING btree (id);


--
-- TOC entry 3749 (class 1259 OID 28842)
-- Name: PK_character; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_character" ON genshin."character" USING btree (id);


--
-- TOC entry 3758 (class 1259 OID 28920)
-- Name: PK_constellation_id; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_constellation_id" ON genshin.constellation USING btree (id);


--
-- TOC entry 3722 (class 1259 OID 28636)
-- Name: PK_enemy_drop; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_enemy_drop" ON genshin.enemy_drop USING btree (id);


--
-- TOC entry 3719 (class 1259 OID 28627)
-- Name: PK_enemy_familiy; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_enemy_familiy" ON genshin.enemy_family USING btree (id);


--
-- TOC entry 3746 (class 1259 OID 28786)
-- Name: PK_food; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_food" ON genshin.food USING btree (id);


--
-- TOC entry 3743 (class 1259 OID 28770)
-- Name: PK_food_type; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_food_type" ON genshin.food_type USING btree (id);


--
-- TOC entry 3740 (class 1259 OID 28761)
-- Name: PK_local_specialty; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_local_specialty" ON genshin.local_specialty USING btree (id);


--
-- TOC entry 3707 (class 1259 OID 28575)
-- Name: PK_region; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_region" ON genshin.region USING btree (id);


--
-- TOC entry 3716 (class 1259 OID 28602)
-- Name: PK_stat; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_stat" ON genshin.stat USING btree (id);


--
-- TOC entry 3755 (class 1259 OID 28888)
-- Name: PK_talent; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_talent" ON genshin.talent USING btree (id);


--
-- TOC entry 3713 (class 1259 OID 28593)
-- Name: PK_talent_book; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_talent_book" ON genshin.talent_book USING btree (id);


--
-- TOC entry 3752 (class 1259 OID 28851)
-- Name: PK_talent_type; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_talent_type" ON genshin.talent_type USING btree (id);


--
-- TOC entry 3735 (class 1259 OID 28726)
-- Name: PK_weapon; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_weapon" ON genshin.weapon USING btree (id);


--
-- TOC entry 3732 (class 1259 OID 28679)
-- Name: PK_weapon_domain_material; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_weapon_domain_material" ON genshin.weapon_domain_material USING btree (id);


--
-- TOC entry 3710 (class 1259 OID 28584)
-- Name: PK_weapon_type; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX "PK_weapon_type" ON genshin.weapon_type USING btree (id);


--
-- TOC entry 3726 (class 1259 OID 30202)
-- Name: boss_region_id_idx; Type: INDEX; Schema: genshin; Owner: postgres
--

CREATE INDEX boss_region_id_idx ON genshin.boss USING btree (region_id);


--
-- TOC entry 3807 (class 2620 OID 28989)
-- Name: daily_record check_if_date_matches; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER check_if_date_matches BEFORE UPDATE ON genshin.daily_record FOR EACH ROW EXECUTE FUNCTION genshin.check_if_date_matches();


--
-- TOC entry 3802 (class 2620 OID 29064)
-- Name: character format_correct; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_correct BEFORE INSERT OR UPDATE ON genshin."character" FOR EACH ROW EXECUTE FUNCTION genshin.add_correct_image_url_q_auto();


--
-- TOC entry 3797 (class 2620 OID 29053)
-- Name: boss_drop format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.boss_drop FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3803 (class 2620 OID 29052)
-- Name: character format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin."character" FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3806 (class 2620 OID 29054)
-- Name: constellation format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.constellation FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3796 (class 2620 OID 29055)
-- Name: enemy_drop format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.enemy_drop FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3801 (class 2620 OID 29056)
-- Name: food format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.food FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3800 (class 2620 OID 29057)
-- Name: local_specialty format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.local_specialty FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3805 (class 2620 OID 29058)
-- Name: talent format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.talent FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3795 (class 2620 OID 29059)
-- Name: talent_book format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.talent_book FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3799 (class 2620 OID 29060)
-- Name: weapon format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.weapon FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3798 (class 2620 OID 29061)
-- Name: weapon_domain_material format_image; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_image BEFORE INSERT OR UPDATE ON genshin.weapon_domain_material FOR EACH ROW EXECUTE FUNCTION genshin.add_image_url_q_auto();


--
-- TOC entry 3804 (class 2620 OID 29065)
-- Name: character format_wrong; Type: TRIGGER; Schema: genshin; Owner: postgres
--

CREATE TRIGGER format_wrong BEFORE INSERT OR UPDATE ON genshin."character" FOR EACH ROW EXECUTE FUNCTION genshin.add_wrong_image_url_q_auto();


--
-- TOC entry 3776 (class 2606 OID 28810)
-- Name: character FK_ascension_stat_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_ascension_stat_id" FOREIGN KEY (ascension_stat_id) REFERENCES genshin.stat(id);


--
-- TOC entry 3773 (class 2606 OID 28743)
-- Name: element FK_associated_region_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.element
    ADD CONSTRAINT "FK_associated_region_id" FOREIGN KEY (associated_region_id) REFERENCES genshin.region(id);


--
-- TOC entry 3764 (class 2606 OID 28660)
-- Name: boss_drop FK_boss_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.boss_drop
    ADD CONSTRAINT "FK_boss_id" FOREIGN KEY (boss_id) REFERENCES genshin.boss(id);


--
-- TOC entry 3785 (class 2606 OID 28855)
-- Name: character_book_map FK_character_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.character_book_map
    ADD CONSTRAINT "FK_character_id" FOREIGN KEY (character_id) REFERENCES genshin."character"(id);


--
-- TOC entry 3787 (class 2606 OID 28873)
-- Name: talent FK_character_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.talent
    ADD CONSTRAINT "FK_character_id" FOREIGN KEY (character_id) REFERENCES genshin."character"(id);


--
-- TOC entry 3789 (class 2606 OID 28897)
-- Name: constellation FK_character_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.constellation
    ADD CONSTRAINT "FK_character_id" FOREIGN KEY (character_id) REFERENCES genshin."character"(id);


--
-- TOC entry 3790 (class 2606 OID 28927)
-- Name: daily_record FK_character_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.daily_record
    ADD CONSTRAINT "FK_character_id" FOREIGN KEY (character_id) REFERENCES genshin."character"(id);


--
-- TOC entry 3768 (class 2606 OID 28721)
-- Name: weapon FK_common_enemy_material_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon
    ADD CONSTRAINT "FK_common_enemy_material_id" FOREIGN KEY (common_enemy_material_id) REFERENCES genshin.enemy_drop(id);


--
-- TOC entry 3791 (class 2606 OID 28937)
-- Name: daily_record FK_constellation_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.daily_record
    ADD CONSTRAINT "FK_constellation_id" FOREIGN KEY (constellation_id) REFERENCES genshin.constellation(id);


--
-- TOC entry 3777 (class 2606 OID 28800)
-- Name: character FK_element_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_element_id" FOREIGN KEY (element_id) REFERENCES genshin.element(id);


--
-- TOC entry 3769 (class 2606 OID 28716)
-- Name: weapon FK_elite_enemy_material_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon
    ADD CONSTRAINT "FK_elite_enemy_material_id" FOREIGN KEY (elite_enemy_material_id) REFERENCES genshin.enemy_drop(id);


--
-- TOC entry 3766 (class 2606 OID 28688)
-- Name: enemy_family_drop_map FK_enemy_drop_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.enemy_family_drop_map
    ADD CONSTRAINT "FK_enemy_drop_id" FOREIGN KEY (enemy_drop_id) REFERENCES genshin.enemy_drop(id);


--
-- TOC entry 3767 (class 2606 OID 28683)
-- Name: enemy_family_drop_map FK_enemy_family_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.enemy_family_drop_map
    ADD CONSTRAINT "FK_enemy_family_id" FOREIGN KEY (enemy_family_id) REFERENCES genshin.enemy_family(id);


--
-- TOC entry 3778 (class 2606 OID 28820)
-- Name: character FK_enhancement_material_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_enhancement_material_id" FOREIGN KEY (enhancement_material_id) REFERENCES genshin.enemy_drop(id);


--
-- TOC entry 3792 (class 2606 OID 28942)
-- Name: daily_record FK_food_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.daily_record
    ADD CONSTRAINT "FK_food_id" FOREIGN KEY (food_id) REFERENCES genshin.food(id);


--
-- TOC entry 3779 (class 2606 OID 28815)
-- Name: character FK_local_specialty_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_local_specialty_id" FOREIGN KEY (local_specialty_id) REFERENCES genshin.local_specialty(id);


--
-- TOC entry 3780 (class 2606 OID 28825)
-- Name: character FK_normal_boss_material_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_normal_boss_material_id" FOREIGN KEY (normal_boss_material_id) REFERENCES genshin.boss_drop(id);


--
-- TOC entry 3763 (class 2606 OID 28646)
-- Name: boss FK_region; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.boss
    ADD CONSTRAINT "FK_region" FOREIGN KEY (region_id) REFERENCES genshin.region(id);


--
-- TOC entry 3765 (class 2606 OID 28673)
-- Name: weapon_domain_material FK_region_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon_domain_material
    ADD CONSTRAINT "FK_region_id" FOREIGN KEY (region_id) REFERENCES genshin.region(id);


--
-- TOC entry 3774 (class 2606 OID 28756)
-- Name: local_specialty FK_region_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.local_specialty
    ADD CONSTRAINT "FK_region_id" FOREIGN KEY (region_id) REFERENCES genshin.region(id);


--
-- TOC entry 3781 (class 2606 OID 28795)
-- Name: character FK_region_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_region_id" FOREIGN KEY (region_id) REFERENCES genshin.region(id);


--
-- TOC entry 3782 (class 2606 OID 28835)
-- Name: character FK_special_dish_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_special_dish_id" FOREIGN KEY (special_dish_id) REFERENCES genshin.food(id);


--
-- TOC entry 3770 (class 2606 OID 28706)
-- Name: weapon FK_sub_stat_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon
    ADD CONSTRAINT "FK_sub_stat_id" FOREIGN KEY (sub_stat_id) REFERENCES genshin.stat(id);


--
-- TOC entry 3786 (class 2606 OID 28860)
-- Name: character_book_map FK_talent_book_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.character_book_map
    ADD CONSTRAINT "FK_talent_book_id" FOREIGN KEY (talent_book_id) REFERENCES genshin.talent_book(id);


--
-- TOC entry 3793 (class 2606 OID 28932)
-- Name: daily_record FK_talent_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.daily_record
    ADD CONSTRAINT "FK_talent_id" FOREIGN KEY (talent_id) REFERENCES genshin.talent(id);


--
-- TOC entry 3771 (class 2606 OID 28701)
-- Name: weapon FK_type_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon
    ADD CONSTRAINT "FK_type_id" FOREIGN KEY (type_id) REFERENCES genshin.weapon_type(id);


--
-- TOC entry 3775 (class 2606 OID 28779)
-- Name: food FK_type_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.food
    ADD CONSTRAINT "FK_type_id" FOREIGN KEY (type_id) REFERENCES genshin.food_type(id);


--
-- TOC entry 3788 (class 2606 OID 28878)
-- Name: talent FK_type_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.talent
    ADD CONSTRAINT "FK_type_id" FOREIGN KEY (type_id) REFERENCES genshin.talent_type(id);


--
-- TOC entry 3772 (class 2606 OID 28711)
-- Name: weapon FK_weapon_domain_material_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.weapon
    ADD CONSTRAINT "FK_weapon_domain_material_id" FOREIGN KEY (weapon_domain_material_id) REFERENCES genshin.weapon_domain_material(id);


--
-- TOC entry 3794 (class 2606 OID 28947)
-- Name: daily_record FK_weapon_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin.daily_record
    ADD CONSTRAINT "FK_weapon_id" FOREIGN KEY (weapon_id) REFERENCES genshin.weapon(id);


--
-- TOC entry 3783 (class 2606 OID 28805)
-- Name: character FK_weapon_type_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_weapon_type_id" FOREIGN KEY (weapon_type_id) REFERENCES genshin.weapon_type(id);


--
-- TOC entry 3784 (class 2606 OID 28830)
-- Name: character FK_weekly_boss_material_id; Type: FK CONSTRAINT; Schema: genshin; Owner: postgres
--

ALTER TABLE ONLY genshin."character"
    ADD CONSTRAINT "FK_weekly_boss_material_id" FOREIGN KEY (weekly_boss_material_id) REFERENCES genshin.boss_drop(id);


--
-- TOC entry 3963 (class 0 OID 28638)
-- Dependencies: 280
-- Name: boss; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.boss ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3964 (class 0 OID 28653)
-- Dependencies: 282
-- Name: boss_drop; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.boss_drop ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3972 (class 0 OID 28788)
-- Dependencies: 297
-- Name: character; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin."character" ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3974 (class 0 OID 28852)
-- Dependencies: 300
-- Name: character_book_map; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.character_book_map ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3976 (class 0 OID 28890)
-- Dependencies: 304
-- Name: constellation; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.constellation ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3977 (class 0 OID 28922)
-- Dependencies: 307
-- Name: daily_record; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.daily_record ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3968 (class 0 OID 28736)
-- Dependencies: 289
-- Name: element; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.element ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3962 (class 0 OID 28629)
-- Dependencies: 278
-- Name: enemy_drop; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.enemy_drop ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3961 (class 0 OID 28618)
-- Dependencies: 276
-- Name: enemy_family; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.enemy_family ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3966 (class 0 OID 28680)
-- Dependencies: 285
-- Name: enemy_family_drop_map; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.enemy_family_drop_map ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3971 (class 0 OID 28772)
-- Dependencies: 295
-- Name: food; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.food ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3970 (class 0 OID 28763)
-- Dependencies: 293
-- Name: food_type; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.food_type ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3969 (class 0 OID 28749)
-- Dependencies: 291
-- Name: local_specialty; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.local_specialty ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3957 (class 0 OID 28551)
-- Dependencies: 267
-- Name: region; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.region ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3960 (class 0 OID 28595)
-- Dependencies: 274
-- Name: stat; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.stat ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3975 (class 0 OID 28866)
-- Dependencies: 302
-- Name: talent; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.talent ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3959 (class 0 OID 28586)
-- Dependencies: 272
-- Name: talent_book; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.talent_book ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3973 (class 0 OID 28844)
-- Dependencies: 299
-- Name: talent_type; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.talent_type ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3967 (class 0 OID 28694)
-- Dependencies: 287
-- Name: weapon; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.weapon ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3965 (class 0 OID 28666)
-- Dependencies: 284
-- Name: weapon_domain_material; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.weapon_domain_material ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3958 (class 0 OID 28577)
-- Dependencies: 270
-- Name: weapon_type; Type: ROW SECURITY; Schema: genshin; Owner: postgres
--

ALTER TABLE genshin.weapon_type ENABLE ROW LEVEL SECURITY;

-- Completed on 2024-05-01 21:34:14 PDT

--
-- PostgreSQL database dump complete
--

