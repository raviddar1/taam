'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function PsukkimPage() {
  useEffect(() => {
    if (sessionStorage.getItem('darkMode') === '1') {
      document.body.classList.add('dark')
    }
  }, [])

  return (
    <>
      <link rel="preload" href="/scripts/psukkim.js?v=3" as="script" />
      <style>{`
* { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #ffffff; font-family: 'TheBasics', sans-serif; }

    #bg {
      display: none;
      position: fixed;
      inset: 0;
      background: #ffffff;
      z-index: 1;
      cursor: default;
    }
    #bg.active { display: block; }

    .canvas-outer {
      position: fixed;
      top: 0; left: 0;
      transform-origin: top left;
      transition: transform 0.5s ease;
      cursor: pointer;
    }
    #canvas-outer-001 { z-index: 4; }
    #canvas-outer-002 { z-index: 3; }
    #canvas-outer-003 { z-index: 2; }
    #canvas-outer-004 { z-index: 1; }
    #canvas-outer-005 { z-index: 1; }
    .canvas-outer.open {
      transform: translate(calc(50vw - 400px), calc(50vh - 100px)) scale(1) !important;
      cursor: default;
    }

    #canvas-outer-001 {
      transform: translate(calc(75vw + 75px), calc(24vh - 48px)) scale(0.36);
    }
    #canvas-outer-001.open {
      transform: translate(calc(50vw - 530px), calc(50vh - 128px)) scale(1.95) !important;
    }
    #canvas-outer-002 {
      transform: translate(calc(51vw + 57px), calc(24vh - 55px)) scale(0.37);
    }
    #canvas-outer-002.open {
      transform: translate(calc(50vw - 820px), calc(50vh - 334px)) scale(1.55) !important;
    }
    #canvas-outer-003 {
      transform: translate(calc(27vw + 50px), calc(24vh - 35px)) scale(0.36);
    }
    #canvas-outer-003.open {
      transform: translate(calc(50vw - 690px), calc(50vh - 240px)) scale(1.25) !important;
    }
    #canvas-outer-004 {
      transform: translate(calc(3vw + 75px), calc(24vh - 65px)) scale(0.20);
    }
    #canvas-outer-004.open {
      transform: translate(calc(50vw - 725px), calc(50vh - 160px)) scale(1) !important;
    }
    #canvas-outer-005 {
      transform: translate(calc(75vw + 33px), calc(39vh - 15px)) scale(0.40);
    }
    #canvas-outer-005.open {
      transform: translate(calc(50vw - 1040px), calc(50vh - 464px)) scale(1.6) !important;
    }
    #canvas-outer-006 { z-index: 1; }
    #canvas-outer-006 {
      transform: translate(calc(51vw + 92px), calc(39vh + 5px)) scale(0.37);
    }
    #canvas-outer-006.open {
      transform: translate(calc(50vw - 490px), calc(50vh - 200px)) scale(1.3) !important;
    }
    #canvas-outer-007 { z-index: 2; }
    #canvas-outer-007 {
      transform: translate(calc(27vw - 120px), calc(39vh + 7px)) scale(0.47);
    }
    #canvas-outer-007.open {
      transform: translate(calc(50vw - 785px), calc(50vh - 265px)) scale(1.75) !important;
    }
    #canvas-outer-008 { z-index: 1; }
    #canvas-outer-008 {
      transform: translate(calc(3vw + 40px), calc(39vh + 10px)) scale(0.47);
    }
    #canvas-outer-008.open {
      transform: translate(calc(50vw - 615px), calc(50vh - 290px)) scale(1.65) !important;
    }
    #canvas-outer-009 { z-index: 5; }
    #canvas-outer-009 {
      transform: translate(calc(75vw + 52px), calc(54vh + 40px)) scale(0.41);
    }
    #canvas-outer-009.open {
      transform: translate(calc(50vw - 620px), calc(50vh - 281px)) scale(1.15) !important;
    }
    #canvas-outer-010 { z-index: 4; }
    #canvas-outer-010 {
      transform: translate(calc(51vw + 60px), calc(54vh + 40px)) scale(0.30);
    }
    #canvas-outer-010.open {
      transform: translate(calc(50vw - 645px), calc(50vh - 301px)) scale(0.9) !important;
    }
    #canvas-outer-011 { z-index: 2; }
    #canvas-outer-011 {
      transform: translate(calc(27vw + 63px), calc(54vh + 45px)) scale(0.30);
    }
    #canvas-outer-011.open {
      transform: translate(calc(50vw - 733px), calc(50vh - 257px)) scale(0.87) !important;
    }
    #canvas-outer-012 { z-index: 1; }
    #canvas-outer-012 {
      transform: translate(calc(3vw + 70px), calc(54vh + 35px)) scale(0.24);
    }
    #canvas-outer-012.open {
      transform: translate(calc(50vw - 822px), calc(50vh - 263px)) scale(1) !important;
    }
    #canvas-outer-013 { z-index: 1; }
    #canvas-outer-013 {
      transform: translate(calc(75vw + 75px), calc(69vh + 75px)) scale(0.25);
    }
    #canvas-outer-013.open {
      transform: translate(calc(50vw - 641px), calc(50vh - 153px)) scale(0.85) !important;
    }
    #canvas-outer-014 { z-index: 1; }
    #canvas-outer-014 {
      transform: translate(calc(51vw + 60px), calc(69vh + 65px)) scale(0.35);
    }
    #canvas-outer-014.open {
      transform: translate(calc(50vw - 540px), calc(50vh - 135px)) scale(0.9) !important;
    }
    #canvas-outer-015 { z-index: 1; }
    #canvas-outer-015 {
      transform: translate(calc(27vw + 95px), calc(69vh + 85px)) scale(0.20);
    }
    #canvas-outer-015.open {
      transform: translate(calc(50vw - 595px), calc(50vh - 170px)) scale(0.85) !important;
    }
    #canvas-outer-016 { z-index: 1; }
    #canvas-outer-016 {
      transform: translate(calc(3vw + 83px), calc(69vh + 75px)) scale(0.16);
    }
    #canvas-outer-016.open {
      transform: translate(calc(50vw - 624px), calc(50vh - 224px)) scale(0.65) !important;
    }
    #meta-001, #meta-002, #meta-003, #meta-004, #meta-005, #meta-006, #meta-007, #meta-008, #meta-009, #meta-010, #meta-011, #meta-012 { top: calc(50vh - 130px); }

    .mini-label {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 11px;
      color: #343434;
      z-index: 5;
      cursor: pointer;
    }

    #open-number {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 16px;
      color: #343434;
      z-index: 5;
      right: calc(50vw - 505px);
      top: calc(50vh + 140px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
    }
    #open-number.active { opacity: 1; visibility: visible; }

    #source-label {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 16px;
      color: #343434;
      z-index: 5;
      left: calc(50vw - 485px);
      top: calc(50vh + 140px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
    }
    #source-label.active { opacity: 1; visibility: visible; }
    #mini-label-001 { right: calc(25vw - 260px);       top: calc(24vh - 39px); }
    #mini-label-002 { right: calc(49vw - 260px);      top: calc(24vh - 39px); }
    #mini-label-003 { right: calc(73vw - 260px);      top: calc(24vh - 39px); }
    #mini-label-004 { right: calc(97vw - 260px);      top: calc(24vh - 39px); }
    #mini-label-005 { right: calc(25vw - 260px);       top: calc(39vh + 1px); }
    #mini-label-006 { right: calc(49vw - 260px);      top: calc(39vh + 1px); }
    #mini-label-007 { right: calc(73vw - 260px);      top: calc(39vh + 1px); }
    #mini-label-008 { right: calc(97vw - 260px);      top: calc(39vh + 1px); }
    #mini-label-009 { right: calc(25vw - 260px);       top: calc(54vh + 31px); }
    #mini-label-010 { right: calc(49vw - 260px);      top: calc(54vh + 31px); }
    #mini-label-011 { right: calc(73vw - 260px);      top: calc(54vh + 31px); }
    #mini-label-012 { right: calc(97vw - 260px);      top: calc(54vh + 31px); }
    #mini-label-013 { right: calc(25vw - 260px);       top: calc(69vh + 61px); }
    #mini-label-014 { right: calc(49vw - 260px);      top: calc(69vh + 61px); }
    #mini-label-015 { right: calc(73vw - 260px);      top: calc(69vh + 61px); }
    #mini-label-016 { right: calc(97vw - 260px);      top: calc(69vh + 61px); }

    .meta-panel {
      display: none;
      position: fixed;
      z-index: 3;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      line-height: 2;
      color: #343434;
      left: calc(50vw - 400px);
      top: calc(50vh - 130px);
      width: 800px;
      direction: rtl;
      justify-content: space-around;
      align-items: baseline;
      gap: 8px;
    }
    .meta-panel.active { display: flex; }

    /* 001 — מילה מתחת לכל טעם */
    #meta-001.active { display: block; width: auto; }
    .w001 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 60px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    /* x = canvas_x × 1.95 + (50vw − 530px), center via translateX(50%) */
    .w001-shmah   { right: calc(50vw - 460px); }
    .w001-israel  { right: calc(50vw - 344px); }
    .w001-yhvh1   { right: calc(50vw - 182px); }
    .w001-elohenu { right: calc(50vw + 13px); }
    .w001-yhvh2   { right: calc(50vw + 210px); }
    .w001-ehad    { right: calc(50vw + 417px); }

    /* 002 — מילה מתחת לכל צורה — right = 50vw + 820 − shape_x × 1.55 */
    #meta-002.active { display: block; width: auto; }
    .w002 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 36px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    .w002-1 { right: calc(50vw - 575px); }  /* grnBar x=900 → על-משכבי */
    .w002-2 { right: calc(50vw - 375px); }  /* bluC center x=771 → בלילות */
    .w002-3 { right: calc(50vw - 228px); }  /* yelC center x=676 → בקשתי */
    .w002-4 { right: calc(50vw - 82px);  }  /* bluBar2 x=582 → את */
    .w002-5 { right: calc(50vw + 80px);  }  /* arc2 x=503 → שאהבה */
    .w002-6 { right: calc(50vw + 178px); }  /* redBar x=414 → נפשי */
    .w002-7 { right: calc(50vw + 277px); }  /* arc1 x=376 → בקשתיו */
    .w002-8 { right: calc(50vw + 437px); }  /* bluBar1 x=247 → ולא */
    .w002-9 { right: calc(50vw + 609px); }  /* blackSq x=136 → מצאתיו */

    /* 003 — מילה מתחת לכל צורה — right = 50vw + 780 − shape_x × 1.4 */
    #meta-003.active { display: block; width: auto; }
    .w003 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 9px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    .w003-1 { right: calc(50vw - 575px); }  /* bluBarR x=1012 → מים */
    .w003-2 { right: calc(50vw - 413px); }  /* triTri x=830 → רבים */
    .w003-3 { right: calc(50vw - 273px); }  /* dblCirc x=770 → לא */
    .w003-4 { right: calc(50vw - 125px); }  /* grnBar x=652 → יוכלו */
    .w003-5 { right: calc(50vw + 50px);  }  /* bluBarM x=512 → לכבות */
    .w003-6 { right: calc(50vw + 208px); }  /* triCirc x=350 → את-האהבה */
    .w003-7 { right: calc(50vw + 345px); }  /* arc1 x=300 → ונהרות */
    .w003-8 { right: calc(50vw + 488px); }  /* bluBarL x=162 → לא */
    .w003-9 { right: calc(50vw + 628px); }  /* redBar x=58 → ישטפוה */

    /* 004 — right = 50vw + 725 − center_x */
    #meta-004.active { display: block; width: auto; }
    .w004 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 71px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    .w004-1 { right: calc(50vw - 544px); }  /* triRight center x=1269 → שיר */
    .w004-2 { right: calc(50vw - 372px); }  /* bluLower center x=1097 → למעלות */
    .w004-3 { right: calc(50vw - 192px); }  /* bluMiddle center x=917 → אשא */
    .w004-4 { right: calc(50vw - 15px);  }  /* greenArc x=770 → עיני */
    .w004-5 { right: calc(50vw + 110px); }  /* red center x=615 → אל-ההרים */
    .w004-6 { right: calc(50vw + 211px); }  /* triLeft center x=514 → מאין */
    .w004-7 { right: calc(50vw + 353px); }  /* bluUpper center x=372 → יבא */
    .w004-8 { right: calc(50vw + 530px); }  /* blackSq center x=195 → עזרי */

    /* 012 — right = 50vw + 772 − center_x × 1.0 */
    #meta-012.active { display: block; width: auto; }
    #meta-013.active { display: block; width: auto; }
    .w013 {
      position: fixed;
      font-family: 'BuGlobal', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 30px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    .w013-1  { right: calc(50vw - 583px); }  /* תרי קדמין   x=1440 → וי֨אמר֙ */
    .w013-2  { right: calc(50vw - 442px); }  /* שופר הולך   x=1274 → יהו֣ה */
    .w013-3  { right: calc(50vw - 280px); }  /* זקף קטון    x=1025 → אלה֔ים */
    .w013-4  { right: calc(50vw - 115px); }  /* תביר        x=889  → לא־ט֛וב */
    .w013-5  { right: calc(50vw +  54px); }  /* מאריך       x=691  → הי֥ות */
    .w013-6  { right: calc(50vw + 150px); }  /* טרחא        x=607  → האד֖ם */
    .w013-7  { right: calc(50vw + 245px); }  /* אתנח        x=466  → לבד֑ו */
    .w013-8  { right: calc(50vw + 358px); }  /* מאריך       x=333  → אעשה־ל֥ו */
    .w013-9  { right: calc(50vw + 469px); }  /* טרחא        x=250  → ע֖זר */
    .w013-10 { right: calc(50vw + 582px); }  /* סוף פסוק    x=70   → כנגדֽו׃ */
    #meta-014.active { display: block; width: auto; }
    .w014 {
      position: fixed;
      font-family: 'BuGlobal', sans-serif;
      font-weight: 300;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 90px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    /* right = 50vw + 540 − cx × 0.9 */
    .w014-1 { right: calc(50vw - 478px); }  /* ar   cx=1187 → י֖שב */
    .w014-2 { right: calc(50vw - 285px); }  /* b2   cx=917  → בס֣תר */
    .w014-3 { right: calc(50vw - 106px); }  /* rr   cx=718  → עלי֑ון */
    .w014-4 { right: calc(50vw +  59px); }  /* b1   cx=535  → בצ֥ל */
    .w014-5 { right: calc(50vw + 278px); }  /* dt   cx=291  → שד֗י */
    .w014-6 { right: calc(50vw + 460px); }  /* sq   cx=89   → יתלונֽן׃ */
    #meta-015.active { display: block; width: auto; }
    .w015 {
      position: fixed;
      font-family: 'BuGlobal', sans-serif;
      font-weight: 300;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 45px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    /* right = 50vw + 595 − cx × 0.85 */
    .w015-1 { right: calc(50vw - 485px); }  /* tg  cx=1270 → כל֫ך */
    .w015-2 { right: calc(50vw - 307px); }  /* gr  cx=1061 → יפה֙ */
    .w015-3 { right: calc(50vw -  99px); }  /* tc  cx=816  → רעית֔י */
    .w015-4 { right: calc(50vw +  61px); }  /* ar  cx=675  → ומ֖ום */
    .w015-5 { right: calc(50vw + 232px); }  /* br  cx=427  → א֥ין */
    .w015-6 { right: calc(50vw + 420px); }  /* sq  cx=205  → בֽך׃ */
    #meta-016.active { display: block; width: auto; }
    .w016 {
      position: fixed;
      font-family: 'BuGlobal', sans-serif;
      font-weight: 300;
      font-size: 27px;
      color: #343434;
      top: calc(50vh - 35px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    /* right = 50vw + 597 − cx × 0.65 */
    .w016-1  { right: calc(50vw - 571px); }  /* bc   cx=1839 → כי־עז֫ה */
    .w016-2  { right: calc(50vw - 434px); }  /* yh   cx=1613 → כמ֨ות֙ */
    .w016-3  { right: calc(50vw - 297px); }  /* bh   cx=1463 → אהב֔ה */
    .w016-4  { right: calc(50vw - 104px); }  /* bl2  cx=1113 → קש֥ה */
    .w016-5  { right: calc(50vw +  48px); }  /* ga2  cx=953  → כשא֖ול */
    .w016-6  { right: calc(50vw + 133px); }  /* rr   cx=755  → קנא֑ה */
    .w016-7  { right: calc(50vw + 209px); }  /* yv2  cx=638  → רשפ֕יה */
    .w016-8  { right: calc(50vw + 299px); }  /* yv1  cx=500  → רשפ֕י */
    .w016-9  { right: calc(50vw + 388px); }  /* ga1  cx=409  → א֖ש */
    .w016-10 { right: calc(50vw + 550px); }  /* bl1  cx=114  → שלה֥בתיֽה׃ */
    .w012 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 7px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    .w012-1 { right: calc(50vw - 630px); }  /* dbl       x=1452 → הבל */
    .w012-2 { right: calc(50vw - 445px); }  /* greenRect x=1267 → הבלים */
    .w012-3 { right: calc(50vw - 256px); }  /* blueRect  x=1078 → אמר */
    .w012-4 { right: calc(50vw -  48px); }  /* three     x=870  → קהלת */
    .w012-5 { right: calc(50vw + 161px); }  /* blueRect  x=661  → הבל */
    .w012-6 { right: calc(50vw + 312px); }  /* greenArc  x=540  → הבלים (טרחא+30) */
    .w012-7 { right: calc(50vw + 476px); }  /* blueRect  x=346  → הכל */
    .w012-8 { right: calc(50vw + 660px); }  /* blackSq   x=162  → הבל */

    /* 011 — right = 50vw + 733 − center_x × 0.87 */
    #meta-011.active { display: block; width: auto; }
    .w011 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 5px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    .w011-1  { right: calc(50vw - 615px); }  /* circ      x=1549 → בקרב */
    .w011-2  { right: calc(50vw - 478px); }  /* greenRect x=1392 → עלי */
    .w011-3  { right: calc(50vw - 334px); }  /* tri       x=1226 → מרעים */
    .w011-4  { right: calc(50vw - 246px); }  /* redBar    x=1125 → לאכל */
    .w011-5  { right: calc(50vw - 141px); }  /* blueRect  x=1005 → את-בשרי */
    .w011-6  { right: calc(50vw +  16px); }  /* blueRect  x=824  → צרי */
    .w011-7  { right: calc(50vw + 176px); }  /* blueRect  x=640  → ואיבי */
    .w011-8  { right: calc(50vw + 286px); }  /* redBar    x=514  → לי */
    .w011-9  { right: calc(50vw + 358px); }  /* greenArc  x=465  → המה (טרחא+30) */
    .w011-10 { right: calc(50vw + 475px); }  /* blueRect  x=296  → כשלו */
    .w011-11 { right: calc(50vw + 611px); }  /* blackSq   x=140  → ונפלו */

    /* 010 — right = 50vw + 695 − center_x × 0.9 */
    #meta-010.active { display: block; width: auto; }
    .w010 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh - 112px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    /* שורה עליונה */
    .w010-1  { right: calc(50vw - 520px); }  /* greenArc   x=1328 → בראשית (טרחא+30) */
    .w010-2  { right: calc(50vw - 400px); }  /* blueRect   x=1161 → ברא */
    .w010-3  { right: calc(50vw - 277px); }  /* redBar     x=1024 → אלהים */
    .w010-4  { right: calc(50vw - 168px); }  /* blueRect   x=903  → את */
    .w010-5  { right: calc(50vw -  54px); }  /* greenArc   x=810  → השמים (טרחא+30) */
    .w010-6  { right: calc(50vw +  47px); }  /* blueRect   x=664  → ואת */
    .w010-7  { right: calc(50vw + 193px); }  /* blackSq    x=502  → הארץ */
    .w010-8  { right: calc(50vw + 329px); }  /* purpleTri  x=351  → והארץ */
    .w010-9  { right: calc(50vw + 448px); }  /* blueRect   x=219  → היתה */
    .w010-10 { right: calc(50vw + 582px); }  /* halfCirc   x=70   → תהו */
    /* שורה תחתונה */
    .w010-11 { right: calc(50vw - 534px); top: calc(50vh + 158px); }  /* three     x=1310 → ובהו */
    .w010-12 { right: calc(50vw - 407px); top: calc(50vh + 158px); }  /* greenArc  x=1202 → וחשך (טרחא+30) */
    .w010-13 { right: calc(50vw - 281px); top: calc(50vh + 158px); }  /* blueRect  x=1029 → על-פני */
    .w010-14 { right: calc(50vw - 150px); top: calc(50vh + 158px); }  /* redBar    x=883  → תהום */
    .w010-15 { right: calc(50vw -  23px); top: calc(50vh + 158px); }  /* blueRect  x=742  → ורוח */
    .w010-16 { right: calc(50vw + 150px); top: calc(50vh + 158px); }  /* three     x=550  → אלהים */
    .w010-17 { right: calc(50vw + 287px); top: calc(50vh + 158px); }  /* greenArc  x=431  → מרחפת */
    .w010-18 { right: calc(50vw + 421px); top: calc(50vh + 158px); }  /* blueRect  x=249  → על-פני */
    .w010-19 { right: calc(50vw + 578px); top: calc(50vh + 158px); }  /* blackSq   x=75   → המים */

    /* 009 — right = 50vw + 620 − center_x × 1.15 */
    #meta-009.active { display: block; width: auto; }
    .w009 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh - 126px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    /* שורה עליונה */
    .w009-1  { right: calc(50vw - 475px); }  /* dbl       x=952 → ויכל */
    .w009-2  { right: calc(50vw - 309px); }  /* greenRect x=808 → אלהים */
    .w009-3  { right: calc(50vw - 137px); }  /* blueRect  x=658 → ביום */
    .w009-4  { right: calc(50vw +  58px); }  /* three     x=489 → השביעי */
    .w009-5  { right: calc(50vw + 203px); }  /* greenArc  x=389 → מלאכתו (טרחא+30) */
    .w009-6  { right: calc(50vw + 369px); }  /* blueRect  x=218 → אשר */
    .w009-7  { right: calc(50vw + 498px); }  /* redBar    x=106 → עשה */
    /* שורה תחתונה */
    .w009-8  { right: calc(50vw - 475px); top: calc(50vh + 151px); }  /* greenRect x=952 → וישבת */
    .w009-9  { right: calc(50vw - 276px); top: calc(50vh + 151px); }  /* blueRect  x=779 → ביום */
    .w009-10 { right: calc(50vw -  53px); top: calc(50vh + 151px); }  /* three     x=585 → השביעי */
    .w009-11 { right: calc(50vw + 108px); top: calc(50vh + 151px); }  /* greenArc  x=471 → מכל-מלאכתו (טרחא+30) */
    .w009-12 { right: calc(50vw + 307px); top: calc(50vh + 151px); }  /* blueRect  x=272 → אשר */
    .w009-13 { right: calc(50vw + 498px); top: calc(50vh + 151px); }  /* blackSq   x=106 → עשה */

    /* 008 — right = 50vw + 600 − center_x × 1.65 */
    #meta-008.active { display: block; width: auto; }
    .w008 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh - 70px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    /* שורה עליונה */
    .w008-1  { right: calc(50vw - 454px); }  /* blueRect  x=648 → יברכך */
    .w008-2  { right: calc(50vw - 329px); }  /* greenArc  x=590 → יהוה (טרחא+30) */
    .w008-3  { right: calc(50vw - 213px); }  /* blackSq   x=502 → וישמרך */
    .w008-4  { right: calc(50vw -  50px); }  /* greenRect x=403 → יאר */
    .w008-5  { right: calc(50vw +  90px); }  /* z         x=318 → יהוה */
    .w008-6  { right: calc(50vw + 219px); }  /* purpleArc x=240 → פניו */
    .w008-7  { right: calc(50vw + 348px); }  /* greenArc  x=180 → אליך (טרחא+30) */
    .w008-8  { right: calc(50vw + 475px); }  /* blackSq   x=85  → ויחנך */
    /* שורה תחתונה */
    .w008-9  { right: calc(50vw - 454px); top: calc(50vh + 215px); }  /* greenRect   x=648 → ישא */
    .w008-10 { right: calc(50vw - 301px); top: calc(50vh + 215px); }  /* blueCircle  x=555 → יהוה */
    .w008-11 { right: calc(50vw - 141px); top: calc(50vh + 215px); }  /* greenRect   x=458 → פניו */
    .w008-12 { right: calc(50vw +  36px); top: calc(50vh + 215px); }  /* threeCirc   x=351 → אליך */
    .w008-13 { right: calc(50vw + 222px); top: calc(50vh + 215px); }  /* blueRect    x=238 → וישם */
    .w008-14 { right: calc(50vw + 348px); top: calc(50vh + 215px); }  /* greenArc    x=180 → לך (טרחא+30) */
    .w008-15 { right: calc(50vw + 480px); top: calc(50vh + 215px); }  /* blackSq     x=82  → שלום */

    /* 007 — right = 50vw + 760 − center_x × 1.75 */
    #meta-007.active { display: block; width: auto; }
    .w007 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 50px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    .w007-1  { right: calc(50vw - 622px); }  /* tri  x=804 → יהוה */
    .w007-2  { right: calc(50vw - 454px); }  /* bar  x=708 → ישמרך */
    .w007-3  { right: calc(50vw - 304px); }  /* red  x=622 → מכל-רע */
    .w007-4  { right: calc(50vw - 185px); }  /* tri  x=554 → ישמר */
    .w007-5  { right: calc(50vw -  75px); }  /* sq   x=492 → את-נפשך */
    .w007-6  { right: calc(50vw +  69px); }  /* tri  x=409 → יהוה */
    .w007-7  { right: calc(50vw + 238px); }  /* bar  x=313 → ישמר-צאתך */
    .w007-8  { right: calc(50vw + 388px); }  /* red  x=227 → ובואך */
    .w007-9  { right: calc(50vw + 498px); }  /* tri  x=164 → מעתה */
    .w007-10 { right: calc(50vw + 609px); }  /* sq   x=101 → ועד-עולם */

    /* 006 — right = 50vw + 490 − center_x × 1.3 */
    #meta-006.active { display: block; width: auto; }
    .w006 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh + 60px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    .w006-1 { right: calc(50vw - 306px); }  /* purpleArc center x=612 → זכור */
    .w006-2 { right: calc(50vw - 87px);  }  /* blueRect  center x=444 → את-יום */
    .w006-3 { right: calc(50vw + 92px);  }  /* greenArc  center x=337 → השבת */
    .w006-4 { right: calc(50vw + 290px); }  /* blackSq   center x=154 → לקדשו */

    /* 005 — right = 50vw + 1040 − center_x × 1.6 */
    #meta-005.active { display: block; width: auto; }
    .w005 {
      position: fixed;
      font-family: 'TheBasics', sans-serif;
      font-size: 27px;
      color: #343434;
      top: calc(50vh - 94px);
      transform: translateX(50%);
      text-align: center;
      z-index: 3;
    }
    /* שורה עליונה */
    .w005-1  { right: calc(50vw - 332px); }  /* [0] bar  x=857 → כבד */
    .w005-2  { right: calc(50vw - 226px); }  /* [1] arc  x=810 → את-אביך */
    .w005-3  { right: calc(50vw - 124px); }  /* [2] red  x=727 → ואת-אמך */
    .w005-4  { right: calc(50vw + 0px);   }  /* [3] half x=650 → למען */
    .w005-5  { right: calc(50vw + 148px); }  /* [4] bar  x=557 → יארכון */
    .w005-6  { right: calc(50vw + 333px); }  /* [5] dots x=442 → ימיך */
    /* שורה תחתונה */
    .w005-7  { right: calc(50vw - 390px); top: calc(50vh + 224px); }  /* [6] tri  x=894 → על */
    .w005-8  { right: calc(50vw - 267px); top: calc(50vh + 224px); }  /* [7] dots x=817 → האדמה */
    .w005-9  { right: calc(50vw - 84px);  top: calc(50vh + 224px); }  /* [8] bar  x=702 → אשר-יהוה */
    .w005-10 { right: calc(50vw + 48px);   top: calc(50vh + 224px); }  /* [9] arc  x=645 → אלהיך */
    .w005-11 { right: calc(50vw + 188px); top: calc(50vh + 224px); }  /* [10] bar x=532 → נתן */
    .w005-12 { right: calc(50vw + 358px); top: calc(50vh + 224px); }  /* [11] sq  x=426 → לך */

    #close-btn { display: none !important; }

    #back-btn { display: none; }

    .navbar { position: fixed; top: 0; left: 0; right: 0; height: 64px; background: transparent; z-index: 10000; display: flex; direction: rtl; align-items: center; justify-content: center; gap: 80px; }
    .nav-logo-sq { position: absolute; right: calc(35/1920*100vw); top: 50%; transform: translateY(-50%); width: 26px; height: 26px; background: #000; display: block; }
    .nav-link { font-family: 'TheBasics', sans-serif; font-size: 17px; color: #343434; text-decoration: none; white-space: nowrap; }
    .nav-link.active { color: #FF179C; border-bottom: 1px solid currentColor; padding-bottom: 0px; font-weight: 600; }
    @keyframes _afl { 0%{transform:none;opacity:1} 35%{transform:translateX(-16px) scale(1.6);opacity:0.15} 100%{transform:none;opacity:1} }
    @keyframes _afr { 0%{transform:none;opacity:1} 35%{transform:translateX(16px)  scale(1.6);opacity:0.15} 100%{transform:none;opacity:1} }
    @keyframes _afu { 0%{transform:none;opacity:1} 35%{transform:translateY(-16px) scale(1.6);opacity:0.15} 100%{transform:none;opacity:1} }
    @keyframes _afd { 0%{transform:none;opacity:1} 35%{transform:translateY(16px)  scale(1.6);opacity:0.15} 100%{transform:none;opacity:1} }
    .arrow-flash-left  { animation:_afl .55s ease-out; }
    .arrow-flash-right { animation:_afr .55s ease-out; }
    .arrow-flash-up    { animation:_afu .55s ease-out; }
    .arrow-flash-down  { animation:_afd .55s ease-out; }

    .nav-aodot { position: absolute; right: calc(48/1920*100vw); top: 50%; transform: translateY(-30%); border-bottom: none !important; }
    .nav-aodot img          { height: 14px; width: auto; display: none; }
    .nav-aodot .logo-light  { display: block; }
    body.dark .nav-aodot .logo-light { display: none; }
    body.dark .nav-aodot .logo-dark  { display: block; }
    #psuk-hint {
      position: fixed; top: 92px; left: 50%; transform: translateX(-50%);
      font-family: 'TheBasics', sans-serif; font-weight: 400; font-size: 17px;
      color: #343434; white-space: nowrap; direction: rtl;
      pointer-events: none; transition: opacity 0.3s ease;
    }
    body.dark #psuk-hint { color: #fff; }
    #psuk-hint.hidden { opacity: 0; }
    
    
    
    .w001,.w002,.w003,.w004,.w005,.w006,.w007,.w008,.w009,.w010,.w011,.w012,.w013,.w014,.w015,.w016 { font-family: 'BuGlobal', sans-serif; font-weight: 300; }
    .page-nav-btn { background:none; border:none; cursor:pointer; color:#e91e8c; font-size:18px; padding:2px 4px; line-height:1; }
    body.dark { background: #131111; }
    body.dark .nav-link:not(.active) { color: #fff; }
    body.dark .nav-logo-sq { background: #fff; }
    body.dark .mini-label { color: #fff; }
    body.dark #open-number, body.dark #source-label { color: #fff; }
    body.dark .meta-panel { color: #fff; }
    body.dark #bg { background: #131111; }
    body.dark .w001, body.dark .w002, body.dark .w003,
    body.dark .w004, body.dark .w005, body.dark .w006,
    body.dark .w007, body.dark .w008, body.dark .w009,
    body.dark .w010, body.dark .w011, body.dark .w012, body.dark .w013, body.dark .w014, body.dark .w015, body.dark .w016 { color: #fff; }
    body.dark #close-btn { color: #fff; }
    .w-active { color: #FF179C !important; }

    /* ---- בוחר מסורת ---- */
    #tradition-wrap {
      display: none;
      position: fixed; bottom: 60px; left: 2vw; z-index: 10;
      font-family: 'TheBasics', sans-serif;
      flex-direction: column; align-items: center; gap: 12px;
    }
    #tradition-wrap.visible { display: flex; }
    #trad-col { display: flex; flex-direction: column; align-items: center; gap: 12px; }
    #trad-list { display:flex; flex-direction:column; gap:11px; text-align:right; direction:rtl; min-width: max-content; }
    .trad-item { font-size:19px; color:#343434; cursor:pointer; pointer-events:all; font-family:'TheBasics', sans-serif; padding:3px 0; }
    .trad-item.active { color: #FF179C; border-bottom: 1px solid currentColor; padding-bottom: 2px; font-weight: 600; }
    .trad-arrow { background:none; border:none; cursor:pointer; color:#e91e8c; padding:0; pointer-events:all; display:flex; align-items:center; justify-content:center; }
    body.dark .trad-item:not(.active) { color: #fff; }

#psuk-vol-faders {
      position: fixed; bottom: 28px; right: 23px; z-index: 60;
      display: none; flex-direction: row; align-items: flex-end; gap: 8px;
    }
    #psuk-vol-faders.visible { display: flex; }
    .psuk-vol-fader { width: 28px; height: 143px; position: relative; top: -10px; cursor: pointer; user-select: none; touch-action: none; }
    .psuk-vol-fader-track { position: absolute; top:0; left:0; right:0; bottom:0; border:1px solid #343434; border-radius:10px; background:transparent; }
    body.dark .psuk-vol-fader-track { border-color:#fff; }
    .psuk-vol-fader-thumb { position:absolute; left:5px; right:5px; height:35px; background:#bbb; border-radius:8px; pointer-events:none; }
    .psuk-vol-fader-label { text-align:center; font-family:'TheBasics',sans-serif; font-size:14px; color:#343434; margin-top:5px; position:relative; top:10px; }
    body.dark .psuk-vol-fader-label { color:#fff; }
      `}</style>

<nav className="navbar">
    <button className="page-nav-btn" id="pnav-next"><svg width="9" height="15" viewBox="0 0 9 15" fill="none"><polyline points="1.5,1.5 7.5,7.5 1.5,13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
    <a href="/taamim" className="nav-link nav-taamim">טעמים</a>
    <a href="/psukkim" className="nav-link nav-psukkim active">פסוקים</a>
    <a href="/taamim?seq" className="nav-link nav-rzf">נגינה</a>
    <a href="/library" className="nav-link nav-info">גלריה</a>
    <button className="page-nav-btn" id="pnav-prev"><svg width="9" height="15" viewBox="0 0 9 15" fill="none"><polyline points="7.5,1.5 1.5,7.5 7.5,13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"/></svg></button>
    <a href="/" className="nav-link nav-aodot"><img src="/logolight.png?v=2" className="logo-light" alt="אודות" /><img src="/logodark.png?v=2" className="logo-dark" alt="אודות" /></a>
  </nav>
  <div id="page-nav">
  </div>
  <div id="psuk-hint">[בחרו פסוק במקלדת, החליפו נוסחים בחיצים]</div>


  <a id="back-btn" href="/">→</a>
  <div id="bg" onClick={() => { const _f = (window as any).closeItem; if(_f) _f(); }}></div>


  <div id="mini-label-001" className="mini-label">001</div>
  <div id="canvas-outer-001" className="canvas-outer">
    <div id="canvas-wrap-001"></div>
  </div>
  <div id="meta-001" className="meta-panel">
    <span className="w001 w001-shmah">שמ֖ע</span>
    <span className="w001 w001-israel">ישרא֑ל</span>
    <span className="w001 w001-yhvh1">יהו֥ה</span>
    <span className="w001 w001-elohenu">אלה֖ינו</span>
    <span className="w001 w001-yhvh2">יהו֥ה</span>
    <span className="w001 w001-ehad">אחֽד׃</span>
  </div>


  <div id="mini-label-002" className="mini-label">002</div>
  <div id="canvas-outer-002" className="canvas-outer">
    <div id="canvas-wrap-002"></div>
  </div>
  <div id="meta-002" className="meta-panel">
    <span className="w002 w002-1">על-משכבי֙</span>
    <span className="w002 w002-2">בליל֔ות</span>
    <span className="w002 w002-3">בק֕שתי</span>
    <span className="w002 w002-4">א֥ת</span>
    <span className="w002 w002-5">שאהב֖ה</span>
    <span className="w002 w002-6">נפש֑י</span>
    <span className="w002 w002-7">בקשת֖יו</span>
    <span className="w002 w002-8">ול֥א</span>
    <span className="w002 w002-9">מצאתֽיו׃</span>
  </div>


  <div id="mini-label-003" className="mini-label">003</div>
  <div id="canvas-outer-003" className="canvas-outer">
    <div id="canvas-wrap-003"></div>
  </div>
  <div id="meta-003" className="meta-panel">
    <span className="w003 w003-1">מ֣ים</span>
    <span className="w003 w003-2">רב֗ים</span>
    <span className="w003 w003-3">ל֤א</span>
    <span className="w003 w003-4">יֽוכלו֙</span>
    <span className="w003 w003-5">לכב֣ות</span>
    <span className="w003 w003-6">את-הֽאהב֔ה</span>
    <span className="w003 w003-7">ונהר֖ות</span>
    <span className="w003 w003-8">ל֣א</span>
    <span className="w003 w003-9">ישטפ֑וה</span>
  </div>


  <div id="mini-label-004" className="mini-label">004</div>
  <div id="canvas-outer-004" className="canvas-outer">
    <div id="canvas-wrap-004"></div>
  </div>
  <div id="meta-004" className="meta-panel">
    <span className="w004 w004-1">שי֗ר</span>
    <span className="w004 w004-2">למעל֥ות</span>
    <span className="w004 w004-3">אש֣א</span>
    <span className="w004 w004-4">ע֖יני</span>
    <span className="w004 w004-5">אל־ההר֑ים</span>
    <span className="w004 w004-6">מא֗ין</span>
    <span className="w004 w004-7">יב֣א</span>
    <span className="w004 w004-8">עזרֽי׃</span>
  </div>


  <div id="mini-label-005" className="mini-label">005</div>
  <div id="canvas-outer-005" className="canvas-outer">
    <div id="canvas-wrap-005"></div>
  </div>
  <div id="meta-005" className="meta-panel">
    <span className="w005 w005-1">כב֥ד</span>
    <span className="w005 w005-2">את־אב֖יך</span>
    <span className="w005 w005-3">ואת־אמ֑ך</span>
    <span className="w005 w005-4">למ֙ען֙</span>
    <span className="w005 w005-5">יארכ֣ון</span>
    <span className="w005 w005-6">ימ֔יך</span>
    <span className="w005 w005-7">ע֚ל</span>
    <span className="w005 w005-8">האדמ֔ה</span>
    <span className="w005 w005-9">אשר־יהו֥ה</span>
    <span className="w005 w005-10">אלה֖יך</span>
    <span className="w005 w005-11">נת֥ן</span>
    <span className="w005 w005-12">לך׃</span>
  </div>


  <div id="mini-label-006" className="mini-label">006</div>
  <div id="canvas-outer-006" className="canvas-outer">
    <div id="canvas-wrap-006"></div>
  </div>
  <div id="meta-006" className="meta-panel">
    <span className="w006 w006-1">זכ֛ור</span>
    <span className="w006 w006-2">את־י֥ום</span>
    <span className="w006 w006-3">השב֭ת</span>
    <span className="w006 w006-4">לקדשו׃</span>
  </div>


  <div id="mini-label-007" className="mini-label">007</div>
  <div id="canvas-outer-007" className="canvas-outer">
    <div id="canvas-wrap-007"></div>
  </div>
  <div id="meta-007" className="meta-panel">
    <span className="w007 w007-1">יהו֗ה</span>
    <span className="w007 w007-2">ישמרך֥</span>
    <span className="w007 w007-3">מכל־ר֑ע</span>
    <span className="w007 w007-4">ישמ֗ר</span>
    <span className="w007 w007-5">את־נפשך׃</span>
    <span className="w007 w007-6">יהו֗ה</span>
    <span className="w007 w007-7">ישמר־צאתך֥</span>
    <span className="w007 w007-8">ובוא֑ך</span>
    <span className="w007 w007-9">מעת֗ה</span>
    <span className="w007 w007-10">ועד־עולם׃</span>
  </div>


  <div id="mini-label-008" className="mini-label">008</div>
  <div id="canvas-outer-008" className="canvas-outer">
    <div id="canvas-wrap-008"></div>
  </div>
  <div id="meta-008" className="meta-panel">
    <span className="w008 w008-1">יברכך֥</span>
    <span className="w008 w008-2">יהו֖ה</span>
    <span className="w008 w008-3">וישמרך׃</span>
    <span className="w008 w008-4">יא֙ר</span>
    <span className="w008 w008-5">יהו֧ה</span>
    <span className="w008 w008-6">פנ֛יו</span>
    <span className="w008 w008-7">אל֖יך</span>
    <span className="w008 w008-8">ויחנך׃</span>
    <span className="w008 w008-9">יש֙א</span>
    <span className="w008 w008-10">יהו֤ה</span>
    <span className="w008 w008-11">פניו֙</span>
    <span className="w008 w008-12">אל֔יך</span>
    <span className="w008 w008-13">ויש֥ם</span>
    <span className="w008 w008-14">לך֖</span>
    <span className="w008 w008-15">שלום׃</span>
  </div>


  <div id="mini-label-009" className="mini-label">009</div>
  <div id="canvas-outer-009" className="canvas-outer">
    <div id="canvas-wrap-009"></div>
  </div>
  <div id="meta-009" className="meta-panel">
    <span className="w009 w009-1">ויכ֤ל</span>
    <span className="w009 w009-2">אלהים֙</span>
    <span className="w009 w009-3">בי֣ום</span>
    <span className="w009 w009-4">השביע֔י</span>
    <span className="w009 w009-5">מלאכת֖ו</span>
    <span className="w009 w009-6">אש֣ר</span>
    <span className="w009 w009-7">עש֑ה</span>
    <span className="w009 w009-8">וישבת֙</span>
    <span className="w009 w009-9">בי֣ום</span>
    <span className="w009 w009-10">השביע֔י</span>
    <span className="w009 w009-11">מכל־מלאכת֖ו</span>
    <span className="w009 w009-12">אש֥ר</span>
    <span className="w009 w009-13">עשה׃</span>
  </div>


  <div id="mini-label-010" className="mini-label">010</div>
  <div id="canvas-outer-010" className="canvas-outer">
    <div id="canvas-wrap-010"></div>
  </div>
  <div id="meta-010" className="meta-panel">
    <span className="w010 w010-1">בראש֭ית</span>
    <span className="w010 w010-2">בר֣א</span>
    <span className="w010 w010-3">אלה֑ים</span>
    <span className="w010 w010-4">א֥ת</span>
    <span className="w010 w010-5">השמ֭ים</span>
    <span className="w010 w010-6">וא֥ת</span>
    <span className="w010 w010-7">הארץ:</span>
    <span className="w010 w010-8">והא֗רץ</span>
    <span className="w010 w010-9">היתה</span>
    <span className="w010 w010-10">ת֙הו֙</span>
    <span className="w010 w010-11">וב֔הו</span>
    <span className="w010 w010-12">וח֖שך</span>
    <span className="w010 w010-13">על-פנ֣י</span>
    <span className="w010 w010-14">תה֑ום</span>
    <span className="w010 w010-15">ור֣וח</span>
    <span className="w010 w010-16">אלה֔ים</span>
    <span className="w010 w010-17">מרחפ֖ת</span>
    <span className="w010 w010-18">על-פנ֥י</span>
    <span className="w010 w010-19">המים:</span>
  </div>


  <div id="mini-label-011" className="mini-label">011</div>
  <div id="canvas-outer-011" className="canvas-outer">
    <div id="canvas-wrap-011"></div>
  </div>
  <div id="meta-011" className="meta-panel">
    <span className="w011 w011-1">בקר֤ב</span>
    <span className="w011 w011-2">על֙י</span>
    <span className="w011 w011-3">מרעים֮</span>
    <span className="w011 w011-4">לאכ֪ל</span>
    <span className="w011 w011-5">את־בשר֥י</span>
    <span className="w011 w011-6">צר֣י</span>
    <span className="w011 w011-7">ואיב֣י</span>
    <span className="w011 w011-8">ל֑י</span>
    <span className="w011 w011-9">ה֭מה</span>
    <span className="w011 w011-10">כשל֣ו</span>
    <span className="w011 w011-11">ונפלו׃</span>
  </div>


  <div id="mini-label-012" className="mini-label">012</div>
  <div id="canvas-outer-012" className="canvas-outer">
    <div id="canvas-wrap-012"></div>
  </div>
  <div id="meta-012" className="meta-panel">
    <span className="w012 w012-1">הב֤ל</span>
    <span className="w012 w012-2">הבלים֙</span>
    <span className="w012 w012-3">אמ֣ר</span>
    <span className="w012 w012-4">קה֔לת</span>
    <span className="w012 w012-5">הב֥ל</span>
    <span className="w012 w012-6">הבל֖ים</span>
    <span className="w012 w012-7">הכ֥ל</span>
    <span className="w012 w012-8">הבל׃</span>
  </div>

  <div id="mini-label-013" className="mini-label">013</div>
  <div id="canvas-outer-013" className="canvas-outer">
    <div id="canvas-wrap-013"></div>
  </div>
  <div id="meta-013" className="meta-panel">
    <span className="w013 w013-1">וי֨אמר֙</span>
    <span className="w013 w013-2">יהו֣ה</span>
    <span className="w013 w013-3">אלה֔ים</span>
    <span className="w013 w013-4">לא־ט֛וב</span>
    <span className="w013 w013-5">הי֥ות</span>
    <span className="w013 w013-6">האד֖ם</span>
    <span className="w013 w013-7">לבד֑ו</span>
    <span className="w013 w013-8">אעשה־ל֥ו</span>
    <span className="w013 w013-9">ע֖זר</span>
    <span className="w013 w013-10">כנגדֽו׃</span>
  </div>

  <div id="mini-label-014" className="mini-label">014</div>
  <div id="canvas-outer-014" className="canvas-outer">
    <div id="canvas-wrap-014"></div>
  </div>
  <div id="meta-014" className="meta-panel">
    <span className="w014 w014-1">י֖שב</span>
    <span className="w014 w014-2">בס֣תר</span>
    <span className="w014 w014-3">עלי֑ון</span>
    <span className="w014 w014-4">בצ֥ל</span>
    <span className="w014 w014-5">שד֗י</span>
    <span className="w014 w014-6">יתלונֽן׃</span>
  </div>

  <div id="mini-label-015" className="mini-label">015</div>
  <div id="canvas-outer-015" className="canvas-outer">
    <div id="canvas-wrap-015"></div>
  </div>
  <div id="meta-015" className="meta-panel">
    <span className="w015 w015-1">כל֫ך</span>
    <span className="w015 w015-2">יפה֙</span>
    <span className="w015 w015-3">רעית֔י</span>
    <span className="w015 w015-4">ומ֖ום</span>
    <span className="w015 w015-5">א֥ין</span>
    <span className="w015 w015-6">בֽך׃</span>
  </div>

  <div id="mini-label-016" className="mini-label">016</div>
  <div id="canvas-outer-016" className="canvas-outer">
    <div id="canvas-wrap-016"></div>
  </div>
  <div id="meta-016" className="meta-panel">
    <span className="w016 w016-1">כי־עז֫ה</span>
    <span className="w016 w016-2">כמ֨ות֙</span>
    <span className="w016 w016-3">אהב֔ה</span>
    <span className="w016 w016-4">קש֥ה</span>
    <span className="w016 w016-5">כשא֖ול</span>
    <span className="w016 w016-6">קנא֑ה</span>
    <span className="w016 w016-7">רשפ֕יה</span>
    <span className="w016 w016-8">רשפ֕י</span>
    <span className="w016 w016-9">א֖ש</span>
    <span className="w016 w016-10">שלה֥בתיֽה׃</span>
  </div>

  <div id="open-number"></div>
  <div id="source-label"></div>
  <button id="close-btn" onClick={() => { const _f = (window as any).closeItem; if(_f) _f(); }}>→</button>
<div id="psuk-vol-faders">
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div className="psuk-vol-fader" id="psuk-fader-L"><div className="psuk-vol-fader-track"></div><div className="psuk-vol-fader-thumb" id="psuk-thumb-L"></div></div>
      <div className="psuk-vol-fader-label">תופים</div>
    </div>
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div className="psuk-vol-fader" id="psuk-fader-R"><div className="psuk-vol-fader-track"></div><div className="psuk-vol-fader-thumb" id="psuk-thumb-R"></div></div>
      <div className="psuk-vol-fader-label">חזן</div>
    </div>
  </div>

      <Script
        src="/p5.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const s = document.createElement('script')
          s.src = '/scripts/psukkim.js?v=3'
          document.body.appendChild(s)
        }}
      />
    </>
  )
}
