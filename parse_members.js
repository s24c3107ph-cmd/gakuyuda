const fs = require('fs');

const rawCsv = `メールアドレス,氏名,氏,名,しめい,,みょうじ,なまえ,回生,部署,学籍番号,学部,学科,学年,生年月日, photo_url
s23A2053td@chibatech.ac.jp,坂井綾太,坂井,綾太,さかいりょうた,Sakai Ryota,さかい,りょうた,4,福祉,23A2053,工学部,機械電子創成工学科,4,2005/1/19,https://drive.google.com/uc?export=view&id=1gHDooFLlsmmCG6zAdcu0_EnhS2HjleZe
s23C1135vq@chibatech.ac.jp,丸山直希,丸山,直希,まるやまなおき,Naoki Maruyama,まるやま,なおき,4,福祉,23C1135,先進工学部,未来ロボティクス学科,4,2004/4/12,https://drive.google.com/uc?export=view&id=1LZnLPf9ty_BR8WQp4iw5-qfyqLR7qIYj
s24C2025CL@chibatech.ac.jp,岡崎理桜,岡崎,理桜,おかざきりお,Okazaki Rio,おかざき,りお,3,福祉,24C2025,先進工学部,生命科学科,3,2005/4/2,https://drive.google.com/uc?export=view&id=1UnnSNu0dyuCThq5Dm2YsWr1GRHjBLXi0
s24C3040RY@chibatech.ac.jp,木村洸太,木村,洸太,きむらこうた,Kouta Kimura,きむら,こうた,3,福祉,24C3040,先進工学部,知能メディア工学科,3,2005/7/17,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s24C3060DU@chibatech.ac.jp,里村茜音,里村,茜音,さとむらあかね,Akane Satomura,さとむら,あかね,3,福祉,24C3060,先進工学部,知能メディア工学科,3,2005/4/6,https://drive.google.com/uc?export=view&id=1FTOXULGseZLxbY7NQpZMeoYENOb1s2UC
s24C3107PH@chibatech.ac.jp,福原出雲,福原,出雲,ふくはらいずも,Fukuhara Izumo,ふくはら,いずも,3,福祉,24C3107,先進工学部,知能メディア工学科,3,2005/12/11,https://drive.google.com/uc?export=view&id=1bNjTIDEgIrZiYryKdFlqUAE0Q2sIjygx
s24B1127tz@chibatech.ac.jp,藤井美碧,藤井,美碧,ふじいみのり,Fujii Minori,ふじい,みのり,3,福祉,24B1127,創造工学部,建築学科,3,2005/10/19,https://drive.google.com/uc?export=view&id=1hG4fpJWswx4pIigAA0Rqm2ZSlS7ke91Q
s24C3110LQ@chibatech.ac.jp,古戸稜空,古戸,稜空,ふるとりく,Furutori,ふると,りく,3,福祉,24C3110,先進工学部,知能メディア工学科,3,2005/6/19,https://drive.google.com/uc?export=view&id=1WI0ZahGZF8YLPODU3BEwOy_qylwEtdKx
s24G3139DC@chibatech.ac.jp,吉本稜葵,吉本,稜葵,よしもといずき,Yoshimoto Izuki,よしもと,いずき,3,福祉,24G3139,情報変革科学部,高度応用情報科学科,3,2006/1/6,https://drive.google.com/uc?export=view&id=1dwe6keOQQfpJiUIPseiiWJxKQ83bFx35
s25b2016ar@chibatech.ac.jp,鵜沢向希,鵜沢,向希,うざわこうき,Uzawa Kouki,うざわ,こうき,2,福祉,25B2016,創造工学部,都市環境工学科,2,2006/10/11,https://drive.google.com/uc?export=view&id=1nBNbBAr5qUB8InwbN8IqpkF55HGMUsrd
s25a5021nj@chibatech.ac.jp,及川晃誠,及川,晃誠,おいかわこうせい,Oikawa Kosei,おいかわ,こうせい,2,福祉,25A5021,工学部,情報通信システム工学科,2,2007/3/11,https://drive.google.com/uc?export=view&id=1tmyKQfRBbc1hZR8onD9rh3WWs5bm2-cZ
s25g3032zy@chibatech.ac.jp,川根優希菜,川根,優希菜,かわねゆきな,Kawane Yukina,かわね,ゆきな,2,福祉,25G3032,情報変革科学部,高度応用情報科学科,2,2006/9/21,https://drive.google.com/uc?export=view&id=1PS1l2WlT9K90glxix_uynvWB7T9A7vra
s25a6072lk@chibatech.ac.jp,高山優斗,高山,優斗,たかやまゆうと,Takayama Yuto,たかやま,ゆうと,2,福祉,25A6072,工学部,応用化学科,2,2006/5/19,https://drive.google.com/uc?export=view&id=16gFJaXnba6_95xC3L9BsKl6ybZEFyanN
s25a4126yy@chibatech.ac.jp,前坂使希,前坂,使希,まえさかしき,Maesaka Shiki,まえさか,しき,2,福祉,25A4126,工学部,電気電子工学科,2,2006/5/4,https://drive.google.com/uc?export=view&id=19--ULOuUXijFC3-YkgXpK0S4vTTIvkMV
s25a5122qx@chibatech.ac.jp,米山宏基,米山,宏基,よねやまひろき,Yoneyama Hiroki,よねやま,ひろき,2,福祉,25A5122,工学部,情報通信システム工学科,2,2006/9/8,https://drive.google.com/uc?export=view&id=1D1HAp44lGzNzfymH22DxWPsiWigRP2VB
s26b2045lg@chibatech.ac.jp,小林暖季,小林,暖季,こばやしはるき,Haruki Kobayashi,こばやし,はるき,1,福祉,26B2046,創造工学部,都市環境工学科,1,2008/02/27,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26c1059ac@chibatech.ac.jp,紺野蒼,紺野,蒼,こんのあおい,Konno Aoi,こんの,あおい,1,福祉,26C1059,先進工学部,未来ロボティクス学科,1,2008/01/13,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26a6105lx@chibatech.ac.jp,真崎輝,真崎,輝,まさきひかる,Masaki Hikaru,まさき,ひかる,1,福祉,26A6105,工学部,応用化学科,1,2007/08/10,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26a1169ug@chibatech.ac.jp,渡邊大志,渡邊,大志,わたなべたいし,Watanabe Taishi,わたなべ,たいし,1,福祉,26A1169,工学部,機械工学科,1,2007/04/23,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s2341013qr@chibatech.ac.jp,飯嶋暖乃,飯嶋,暖乃,いいじまのの,Iijima no,いいじま,のの,4,総務,2341013,社会システム科学部,経営情報科学科,4,2005/1/8,https://drive.google.com/uc?export=view&id=1NaFX0q70PRRGpDjZQmW4IEDnrW7_IgUQ
s23C3011pz@chibatech.ac.jp,上田青奈,上田,青奈,うえだせな,Ueda Sena,うえだ,せな,4,総務,23C3011,先進工学部,知能メディア工学科,4,2004/11/24,https://drive.google.com/uc?export=view&id=1L009LJhjZeiKz3BudTL3n4YQiSX6YQW2
s23A1058uw@chibatech.ac.jp,栗原悠,栗原,悠,くりはらゆう,Kurihara Yu,くりはら,ゆう,4,総務,23A1058,工学部,機械工学科,4,2004/12/28,https://drive.google.com/uc?export=view&id=1xAeKDV4LLNZwIojuJTg9_oo0Jb_5ak6f
s2341065lu@chibatech.ac.jp,小谷津光里,小谷津,光里,こやつひかり,This guy is Hikari,こやつ,ひかり,4,総務,2341065,社会システム科学部,経営情報科学科,4,2004/8/20,https://drive.google.com/uc?export=view&id=1m_VxKCMmuaB2Eo1uQt5V5zWQas9ULiTj
s2342078uf@chibatech.ac.jp,竹本拓海,竹本,拓海,たけもとたくみ,Takemoto Takumi,たけもと,たくみ,4,総務,2342078,社会システム科学部,プロジェクトマネジメント学科,4,2004/7/13,https://drive.google.com/uc?export=view&id=1auoDtDKEB1qj08KyZrmImRmUwdgUit8z
s2341093tj@chibatech.ac.jp,富田晃,富田,晃,とみたあきら,Akira Tomita,とみた,あきら,4,総務,2341093,社会システム科学部,経営情報科学科,4,2004/10/27,https://drive.google.com/uc?export=view&id=1EGUfRvD9FPSLGwAtnmcWtUQrab6sdP5a
s23A3114lp@chibatech.ac.jp,根本大生,根本,大生,ねもとひろき,Nemoto Hiroki,ねもと,ひろき,4,総務,23A3114,工学部,先端材料工学科,4,2004/8/6,https://drive.google.com/uc?export=view&id=1u_0686g_Xxn-78L9YnQU6_3B4fNcikAO
s24K1030WA@chibatech.ac.jp,川上丈琉,川上,丈琉,かわかみたける,Takeru Kawakami,かわかみ,たける,3,総務,24K1030,未来変革科学部,デジタル変革科学科,3,2005/7/13,https://drive.google.com/uc?export=view&id=1ekwqP5ECKYGQ66IySoqiKrdSTl9AAXs8
s24A3062zd@chibatech.ac.jp,瀬上蒼太,瀬上,蒼太,せのうえそうた,Senoue Sota,せのうえ,そうた,3,総務,24A3062,工学部,先端材料工学科,3,2005/4/21,https://drive.google.com/uc?export=view&id=1Jdl4qzhyquWL6kY5yOrDm8MEfsmjgkz5
s24A1100GH@chibatech.ac.jp,田邉湧大,田邉,湧大,たなべゆうだい,Tanabe Yudai,たなべ,ゆうだい,3,総務,24A1100,工学部,機械工学科,3,2005/6/1,https://drive.google.com/uc?export=view&id=1nX2UB4ZqwoY4fyK-AQGrMsZTsO6if679
s24A4106FJ@chibatech.ac.jp,土屋怜士,土屋,怜士,つちやれいじ,Tsuchiya Reiji,つちや,れいじ,3,総務,24A4106,工学部,電気電子工学科,3,2005/5/30,https://drive.google.com/uc?export=view&id=1hEi_1S3S11HgzZGp_zZXhyJSMeZb6cbC
s24K2108KE@chibatech.ac.jp,益田康生,益田,康生,ますだこうき,Masuda Koki,ますだ,こうき,3,総務,24K2108,未来変革科学部,経営デザイン科学科,3,2005/12/13,https://drive.google.com/uc?export=view&id=1nHeoJCO3r1Tn-IJkwsc8RFE9j-rwJTYm
s25a5008cv@chibatech.ac.jp,石倉圭人,石倉,圭人,いしくらけいと,Ishikura Keito,いしくら,けいと,2,総務,25A5008,工学部,情報通信システム工学科,2,2006/10/6,https://drive.google.com/uc?export=view&id=1oRmcWCpw-BR6usg785JBNCJhMsQUS-qq
s25a5059lr@chibatech.ac.jp,下山田恵悠,下山田,恵悠,しもやまだよしひさ,Yoshihisa Shimoyama,しもやまだ,よしひさ,2,総務,25A5059,工学部,情報通信システム工学科,2,2007/1/18,https://drive.google.com/uc?export=view&id=1Nqk4TyBfPT7OVZXUE7giCaQWKaU2E71B
s25g3082sy@chibatech.ac.jp,瀧澤朱音,瀧澤,朱音,たきざわあかね,Akane Takizawa,たきざわ,あかね,2,総務,25G3082,情報変革科学部,高度応用情報科学科,2,2006/5/9,https://drive.google.com/uc?export=view&id=1kLlno8_e44z_nwSieHnO3-lY4jB0GFdz
s25k1077wk@chibatech.ac.jp,田中瑞規,田中,瑞規,たなかみずき,Tanaka Mizuki,たなか,みずき,2,総務,25K1077,未来変革科学部,デジタル変革科学科,2,2006/12/21,https://drive.google.com/uc?export=view&id=1JnnnZk00ZZZYlSm0HSdEyT_9WTStPLoI
s25c2130du@chibatech.ac.jp,山本結月,山本,結月,やまもとゆづき,Yamamoto Yuzuki,やまもと,ゆづき,2,総務,25C2130,先進工学部,生命科学科,2,2006/12/26,https://drive.google.com/uc?export=view&id=1UBq7ize_o6o39xoo5us5aEcuH0TCzagQ
s25k1121ry@chibatech.ac.jp,米村聖翔,米村,聖翔,よねむらまさと,Masato Yonemura,よねむら,まさと,2,総務,25K1121,未来変革科学部,デジタル変革科学科,2,2006/5/15,https://drive.google.com/uc?export=view&id=1Q7z1WXNd7DPHXiSqE2ZMdswznl--PS-E
s25k1127fk@chibatech.ac.jp,渡邊陸斗,渡邊,陸斗,わたなべりくと,Watanabe Rikuto,わたなべ,りくと,2,総務,25K1127,未来変革科学部,デジタル変革科学科,2,2006/10/6,https://drive.google.com/uc?export=view&id=173Q_wKBBOhE2cKjC9OxnbnouOYksdpD3
s26g3001ny@chibatech.ac.jp,相原悠太,相原,悠太,あいはらゆうた,Aihara Yuta,あいはら,ゆうた,1,総務,26G3001,情報変革科学部,高度応用情報科学科,1,2007/10/12,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26g3029ca@chibatech.ac.jp,大野陽夏,大野,陽夏,おおのはるか,Ohno Haruka,おおの,はるか,1,総務,26G3029,情報変革科学部,高度応用情報科学科,1,2007/07/11,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26k2038fh@chibatech.ac.jp,小山凌矢,小山,凌矢,こやまりょうや,Koyama Ryoya,こやま,りょうや,1,総務,26K2038,未来変革科学部,経営デザイン科学科,1,2008/01/19,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s25a4075bh@chibatech.ac.jp,鈴木脩太,鈴木,脩太,すずきしゅうた,Shuta Suzuki,すずき,しゅうた,1,総務,25A4075,工学部,電気電子工学科,2,2006/08/15,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26g1110zj@chibatech.ac.jp,星野竜吾,星野,竜吾,ほしのりゅうご,Hoshino Ryugo,ほしの,りゅうご,1,総務,26G1110,情報変革科学部,情報工学科,1,2007/12/26,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s23A5018tl@chibatech.ac.jp,大石啓太,大石,啓太,おおいしけいた,Oishi Keita,おおいし,けいた,4,渉外,23A5018,工学部,情報通信システム工学科,4,2004/11/6,https://drive.google.com/uc?export=view&id=1rVg9cKgJrWL3BmKMtQavoY6lc_8uUf5n
s2342098cl@chibatech.ac.jp,野崎桜咲,野崎,桜咲,のざきさくら,Sakura Nozaki,のざき,さくら,4,渉外,2342098,社会システム科学部,プロジェクトマネジメント学科,4,2004/12/13,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s24C2005LC@chibatech.ac.jp,石塚真矢,石塚,真矢,いしつかしんや,Ishitsuka Shinya,いしつか,しんや,3,渉外,24C2005,先進工学部,生命科学科,3,2005/12/25,https://drive.google.com/uc?export=view&id=1RTSQW8cWP8XAz7zLSu7J4YFe-r2h7uSH
s24B1075ZS@chibatech.ac.jp,佐藤志帆,佐藤,志帆,さとうしほ,Sato Shiho,さとう,しほ,3,渉外,24B1075,創造工学部,建築学科,3,2005/8/21,https://drive.google.com/uc?export=view&id=1tYwqnKtM-7dpdoq6mflMKCK6acgyTqAZ
s24A5071ml@chibatech.ac.jp,高橋宏典,高橋,宏典,たかはしひろのり,Takahashi Hironori,たかはし,ひろのり,3,渉外,24A5071,工学部,情報通信システム工学科,3,2004/10/22,https://drive.google.com/uc?export=view&id=1I9mJ_vgiLtqHiVE99nNLP9eh6Y0JsSbE
s24A4122YC@chibatech.ac.jp,長澤圭介,長澤,圭介,ながさわけいすけ,Nagasawa Keisuke,ながさわ,けいすけ,3,渉外,24A4122,工学部,電気電子工学科,3,2005/10/31,https://drive.google.com/uc?export=view&id=1b74W4qRNBOMfvuR48e3T7YSqIgc1pT8Z
s24C2102PD@chibatech.ac.jp,藤田凉,藤田,凉,ふじたりょう,Fujita Ryo,ふじた,りょう,3,渉外,24C2102,先進工学部,生命科学科,3,2005/7/7,https://drive.google.com/uc?export=view&id=1GhA_qupnj_1gs0dK5q1ndKl2WcyGY953
s24B3120TS@chibatech.ac.jp,光末真朱,光末,真朱,みつすえまそほ,Mitsusue Masaho,みつすえ,まそほ,3,渉外,24B3120,創造工学部,デザイン科学科,3,2005/11/15,https://drive.google.com/uc?export=view&id=1FTDcocclI74RS3ntZe5L4wPhGF0mujb-
s24C2114HQ@chibatech.ac.jp,宮﨑昴,宮﨑,昴,みやざきすばる,Miyazaki Subaru,みやざき,すばる,3,渉外,24C2114,先進工学部,生命科学科,3,2005/7/5,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s25a5001jt@chibatech.ac.jp,相田悠希,相田,悠希,あいだはるき,Aida Haruki,あいだ,はるき,2,渉外,25A5001,工学部,情報通信システム工学科,2,2006/10/19,https://drive.google.com/uc?export=view&id=1hFuMULCIwadWwT7TQsBU43XsY3o4AEtG
s25b1044ww@chibatech.ac.jp,金沢拓翔,金沢,拓翔,かなざわたくと,Kanazawa Takuto,かなざわ,たくと,2,渉外,25B1044,創造工学部,建築学科,2,2006/4/2,https://drive.google.com/uc?export=view&id=1_TTUtz35l1X9a1wJwBShZGMl16AQFAGd
s25a1121sc@chibatech.ac.jp,藤田希花,藤田,希花,ふじたののか,Fujita Nonoka,ふじた,ののか,2,渉外,25A1121,工学部,機械工学科,2,2006/9/22,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s25a6101yf@chibatech.ac.jp,古谷駿如,古谷,駿如,ふるやしゅんすけ,Furuya Shunsuke,ふるや,しゅんすけ,2,渉外,25A6101,工学部,応用化学科,2,2006/9/5,https://drive.google.com/uc?export=view&id=1-ymojG7t9Crq-eqXgd0UdYGkvfoQWQOP
s25a5125gf@chibatech.ac.jp,渡邉晴琉,渡邉,晴琉,わたなべはるる,Watanabe Haruru,わたなべ,はるる,2,渉外,25A5125,工学部,情報通信システム工学科,2,2006/8/22,https://drive.google.com/uc?export=view&id=18mcaOc5_YlO5FGVTgAsc28u_3VoZqTrs
s25a6125uv@chibatech.ac.jp,渡辺夢叶,渡辺,夢叶,わたなべめいと,Watanabe Meito,わたなべ,めいと,2,渉外,25A6125,工学部,応用化学科,2,2006/11/5,https://drive.google.com/uc?export=view&id=1a41v5L7h_u7f23kJabKDiu0yO6LP86gL
s26b2055fg@chibatech.ac.jp,佐藤響稀,佐藤,響稀,さとうひびき,Sato Hibiki,さとう,ひびき,1,渉外,26B2055,創造工学部,都市環境工学科,1,2007/10/30,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26g1069bw@chibatech.ac.jp,鈴木博文,鈴木,博文,すずきひろふみ,Suzuki Hirofumi,すずき,ひろふみ,1,渉外,26G1069,情報変革科学部,情報工学科,1,2004/06/21,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26c3081kw@chibatech.ac.jp,手塚優貴,手塚,優貴,てづかゆうき,Tezuka Yuuki,てづか,ゆうき,1,渉外,26C3081,先進工学部,知能メディア工学科,1,2007/05/12,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26a4147he@chibatech.ac.jp,宮間智史,宮間,智史,みやまさとし,Satoshi Miyama,みやま,さとし,1,渉外,26A4147,工学部,電気電子工学科,1,2007/09/28,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s23B2012qf@chibatech.ac.jp,石川夏輝,石川,夏輝,いしかわなつき,Natsuki Ishikawa,いしかわ,なつき,4,財務,23B2012,創造工学部,都市環境工学科,4,2004/7/19,https://drive.google.com/uc?export=view&id=1GFI3Du5fT7RUVZ_YOWK6G8uM6L_2_5_k
s2341022aa@chibatech.ac.jp,上田和正,上田,和正,うえだかずまさ,Ueda Kazumasa,うえだ,かずまさ,4,財務,2341022,社会システム科学部,経営情報科学科,4,2005/2/15,https://drive.google.com/uc?export=view&id=1uTk7QfePyqESRHexIqFTp19Yk4yky66n
s23B1037dj@chibatech.ac.jp,川口日夏,川口,日夏,かわぐちひなつ,Kawaguchi Hinatsu,かわぐち,ひなつ,4,財務,23B1037,創造工学部,建築学科,4,2004/7/30,https://drive.google.com/uc?export=view&id=1lTVnf2dSgbvLZPHMpOSNZpDsUpMgyaKf
s2341069cr@chibatech.ac.jp,齋藤義正,齋藤,義正,さいとうよしまさ,Yoshimasa Saito,さいとう,よしまさ,4,財務,2341069,社会システム科学部,経営情報科学科,4,2004/4/30,https://drive.google.com/uc?export=view&id=12n-hMADkbvfehFdRi2x7jHvYvW2JZIBg
s23A1161ql@chibatech.ac.jp,柳雄太,柳,雄太,やなぎゆうた,Yanagi Yuta,やなぎ,ゆうた,4,財務,23A1161,工学部,機械工学科,4,2004/5/30,https://drive.google.com/uc?export=view&id=1Y5CfemML9Vm8OU1w9feBD0PT4EJwbdQ8
s24G1042xe@chibatech.ac.jp,鎌田素木,鎌田,素木,かまたもとき,Kamata Motoki,かまた,もとき,3,財務,24G1042,情報変革科学部,情報工学科,3,2005/9/19,https://drive.google.com/uc?export=view&id=16hk9tbKbny7PPtAESc6GnDpysVxJVPZ5
s24K1031LJ@chibatech.ac.jp,川田大翔,川田,大翔,かわたひろと,Kawata Hiroto,かわた,ひろと,3,財務,24K1031,未来変革科学部,デジタル変革科学科,3,2005/7/11,https://drive.google.com/uc?export=view&id=1B3aHgyHg0tY6YwNp7iUcm0SGHUXRIyll
s24C2041CW@chibatech.ac.jp,幸田麻友子,幸田,麻友子,こうだまゆこ,Kouda Mayuko,こうだ,まゆこ,3,財務,24C2041,先進工学部,生命科学科,3,2005/9/21,https://drive.google.com/uc?export=view&id=1GFzOIH4ZHSFRE6Xur2JvDdh0QfoXS125
s24G1102NY@chibatech.ac.jp,冨田一之心,冨田,一之心,とみたいちのしん,Tomitai Ichinoshin,とみた,いちのしん,3,財務,24G1102,情報変革科学部,情報工学科,3,2006/2/28,https://drive.google.com/uc?export=view&id=1WUqI_fPcxBeE0cRA1Fyj9xGcyZxsIRDx
s25k2017sh@chibatech.ac.jp,大瀬戸友,大瀬戸,戸友,おおせとゆう,Ooseto Yu,おおせと,ゆう,2,財務,25K2017,未来変革科学部,経営デザイン科学科,2,2006/6/23,https://drive.google.com/uc?export=view&id=1h5dT9Ns49MKQRRwkyB6X7a2r8tAjjn0p
s24a3033qt@chibatech.ac.jp,梶原晃太郎,梶原,晃太郎,かじはらこうたろう,Kajihara Kotaro,かじはら,こうたろう,2,財務,24A3033,工学部,先端材料工学科,3,2005/9/21,https://drive.google.com/uc?export=view&id=1lus67k1az5D8vjtOnLqHqvUJrXr0Db5K
s25g3029mu@chibatech.ac.jp,加藤春輔,加藤,春輔,かとうしゅんすけ,Shunsuke Kato,かとう,しゅんすけ,2,財務,25G3029,情報変革科学部,高度応用情報科学科,2,2007/3/23,https://drive.google.com/uc?export=view&id=1fOOkRVwWRUuxtAf2kPQNhcViuYQQmXg_
s25b2048ed@chibatech.ac.jp,桑原沙季,桑原,沙季,くわはらさき,Kuwaharasaki,くわはら,さき,2,財務,25B2048,創造工学部,都市環境工学科,2,2006/11/29,https://drive.google.com/uc?export=view&id=1vCQxGabogMCV2dGtNbd7DXfNlQwu1m2p
s25g1064yw@chibatech.ac.jp,佐土駿,佐土,駿,さどしゅん,Sadoshun,さど,しゅん,2,財務,25G1064,情報変革科学部,情報工学科,2,2006/9/20,https://drive.google.com/uc?export=view&id=1z9sL73Le1J-Zau7NEJQ0c6D05L_j5TCw
s25a5071hn@chibatech.ac.jp,田﨑太陽,田﨑,太陽,たざきたいよう,Tazaki Taiyou,たざき,たいよう,2,財務,25A5071,工学部,情報通信システム工学科,2,2005/11/30,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26c1042eb@chibatech.ac.jp,川上翔,川上,翔,かわかみしょう,Kawakami Sho,かわかみ,しょう,1,財務,26C1042,先進工学部,未来ロボティクス学科,1,2006/04/06,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26a1121ub@chibatech.ac.jp,平澤輝一,平澤,輝一,ひらさわきいち,Hirasawa Kiichi,ひらさわ,きいち,1,財務,26A1121,工学部,機械工学科,1,2006/08/30,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26b2108jz@chibatech.ac.jp,藤田夏帆,藤田,夏帆,ふじたかほ,Fujitakaho,ふじた,かほ,1,財務,26B2108,創造工学部,都市環境工学科,1,2007/07/27,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26a5126vu@chibatech.ac.jp,渡辺寛大,渡辺,寛大,わたなべかんた,Kanta Watanabe,わたなべ,かんた,1,財務,26A5126,工学部,情報通信システム工学科,1,2007/11/14,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s23A6044xm@chibatech.ac.jp,北村界翔,北村,界翔,きたむらかいと,Kitamura Kaito,きたむら,かいと,4,広報,23A6044,工学部,応用化学科,4,2004/6/5,https://drive.google.com/uc?export=view&id=1yiea6Cl9Se33c1YTifIMbqAp0I44-aIT
s2342079sl@chibatech.ac.jp,田嶋莉子,田嶋,莉子,たじまりこ,Tajima Mariko,たじま,りこ,4,広報,2342079,社会システム科学部,プロジェクトマネジメント学科,4,2004/2/23,https://drive.google.com/uc?export=view&id=1E_ai_PB5GuCM1jJLGiIKlURiLRNMku_H
s2332116qw@chibatech.ac.jp,中村史緒,中村,史緒,なかむらしお,Nakamura Shio,なかむら,しお,4,広報,2332116,情報科学部,情報ネットワーク学科,4,2005/1/14,https://drive.google.com/uc?export=view&id=18lWoKj2q01xdcDVj5uBls3whwNSADTwC
s23A2129kx@chibatech.ac.jp,松田輝,松田,輝,まつだひかる,Matsuda Hikaru,まつだ,ひかる,4,広報,23A2129,工学部,機械電子創成工学科,4,2004/9/24,https://drive.google.com/uc?export=view&id=1bStY1L0U74Ko7ic61FUYGXJaL9x3oKh7
s2331137cr@chibatech.ac.jp,松野愛海,松野,愛海,まつのあみ,Pine net,まつの,あみ,4,広報,2331137,情報科学部,情報工学科,4,2005/2/7,https://drive.google.com/uc?export=view&id=1ec8gm__3sCAdT4-0ALCxomliOqs9Zsye
s23B2125vk@chibatech.ac.jp,本杉京太郎,本杉,京太郎,もとすぎきょうたろう,Motosugi Kyotaro,もとすぎ,きょうたろう,4,広報,23B2125,創造工学部,都市環境工学科,4,2005/3/29,https://drive.google.com/uc?export=view&id=1seE0RY2sL44zpOot7bTIPKO1xdBy-ekw
s2342128wb@chibatech.ac.jp,山口憧也,山口,憧也,やまぐちとうや,Yamaguchi Touya,やまぐち,とおや,4,広報,2342128,社会システム科学部,プロジェクトマネジメント学科,4,2004/8/24,https://drive.google.com/uc?export=view&id=1MVR7sd0uIxX4ifCUTbrf5rk-z1DuUNfU
s24A6033FC@chibatech.ac.jp,小柳津涼,小柳津,涼,おやいづりょう,Oyazuryou,おやいづ,りょう,3,広報,24A6033,工学部,応用化学科,3,2005/6/21,https://drive.google.com/uc?export=view&id=1DNqaa3zZlLIoceLK8zIL7SP3i2JSjaed
s24A6041HZ@chibatech.ac.jp,北見澪,北見,澪,きたみみお,Kitamimio,きたみ,みお,3,広報,24A6041,工学部,応用化学科,3,2005/9/7,https://drive.google.com/uc?export=view&id=1xsFCHRD1Gnk8guAJnBRHChQSDSFDHvoQ
s24A4055ly@chibatech.ac.jp,古西浩基,古西,浩基,こにしこうき,Konishi Koki,こにし,こうき,3,広報,24A4055,工学部,電気電子工学科,3,2005/11/21,https://drive.google.com/uc?export=view&id=1choWCWm1kSeZukYdO110k57mXvnEYZhJ
s24C2059JS@chibatech.ac.jp,佐藤由菜,佐藤,由菜,さとうゆな,Sato Yuna,さとう,ゆな,3,広報,24C2059,先進工学部,生命科学科,3,2006/3/21,https://drive.google.com/uc?export=view&id=1iZ9vDlTGCEND4bPUFSTcOC96yhdHZY9z
s24B3084ZA@chibatech.ac.jp,舘山向日葵,舘山,向日葵,たてやまひまわり,Tateyama Sunflower,たてやま,ひまわり,3,広報,24B3084,創造工学部,デザイン科学科,3,2005/9/23,https://drive.google.com/uc?export=view&id=15ff7_EPWgAftLNOIH9aMfVGR9qoX9Cen
s25k2037ec@chibatech.ac.jp,坂本太一,坂本,太一,さかもとたいち,Sakamoto Taichi,さかもと,たいち,2,広報,25K2037,未来変革科学部,経営デザイン科学科,2,2006/12/16,https://drive.google.com/uc?export=view&id=1t7z5cvulr79TIXVa8O0rGlC3eiQYUH-D
s25c2078lu@chibatech.ac.jp,鈴木涼子,鈴木,涼子,すずきりょうこ,Ryoko Suzuki,すずき,りょうこ,2,広報,25C2078,先進工学部,生命科学科,2,2006/9/2,https://drive.google.com/uc?export=view&id=1p2Qiol8JRzVdGFs-ZH_2E8WLVIb6IbdQ
s25g2096sk@chibatech.ac.jp,西澤陽生,西澤,陽生,にしざわはるき,Nishizawa Haruki,にしざわ,はるき,2,広報,25G2096,情報変革科学部,認知情報科学科,2,2006/12/2,https://drive.google.com/uc?export=view&id=15sqdYn6pcgHg3TOxf0JAscq-r_8ItZq5
s25g3123um@chibatech.ac.jp,味﨑有希,味﨑,有希,みさきゆうき,Misaki Yuuki,みさき,ゆうき,2,広報,25G3123,情報変革科学部,高度応用情報科学科,2,2007/3/28,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s25a4139ru@chibatech.ac.jp,望月大誠,望月,大誠,もちづきたいせい,Mochizuki Taisei,もちづき,たいせい,2,広報,25A4139,工学部,電気電子工学科,2,2006/2/6,https://drive.google.com/uc?export=view&id=1TWbPFrvWnaWPw82-R4g7ibCsWKp3vvxa
s26g1016an@chibatech.ac.jp,伊藤舞依,伊藤,舞依,いとうまい,Ito Mai,いとう,まい,1,広報,26G1016,情報変革科学部,情報工学科,1,2008/03/05,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26g3062pt@chibatech.ac.jp,小谷泰慶,小谷,泰慶,こたに　ひろよし,Kotani Hiroyoshi,こたに,ひろよし,1,広報,26G3062,情報変革科学部,高度応用情報科学科,1,2007/10/06,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26a5049xt@chibatech.ac.jp,坂下朗,坂下,朗,さかしたあきら,Sakashita Akira,さかした,あきら,1,広報,26A5049,工学部,情報通信システム工学科,1,2007/08/23,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26b3064cr@chibatech.ac.jp,篠塚祐輔,篠塚,祐輔,しのづかゆうすけ,Shinozuka Yusuke,しのづか,ゆうすけ,1,広報,26B3064,創造工学部,デザイン科学科,1,2007/04/08,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s23A1001zb@chibatech.ac.jp,青木遼斗,青木,遼斗,あおきはると,Aoki Haruto,あおき,はると,4,厚生,23A1001,工学部,機械工学科,4,2004/6/17,https://drive.google.com/uc?export=view&id=1DPgkt7BJcpdWwtScxg3t7yDkWywh5-JC
s23A2029vb@chibatech.ac.jp,金澤明輝,金澤,明輝,かなざわはるき,Kanazawa Haruki,かなざわ,はるき,4,厚生,23A2029,工学部,機械電子創成工学科,4,2004/8/21,https://drive.google.com/uc?export=view&id=1kFtbY4PrBrHjmc1RJsdP2vrgAVJmqhFs
s23A4114lz@chibatech.ac.jp,田辺和也,田辺,和也,たなべかずや,Tanabe Kazuya,たなべ,かずや,4,厚生,23A4114,工学部,電気電子工学科,4,2004/10/22,https://drive.google.com/uc?export=view&id=1mu4EIpJA8VnjisIw_1As0p17TwyHShqQ
s24C2037ZH@chibatech.ac.jp,工藤圭悟,工藤,圭悟,くどうけいご,Keigo Kudo,くどう,けいご,3,厚生,24C2037,先進工学部,生命科学科,3,2005/9/1,https://drive.google.com/uc?export=view&id=1m-XBRHoVMAikLcl0gCU0Uf7l2S-Dee0Y
s24A6043HZ@chibatech.ac.jp,熊谷來実,熊谷,來実,くまがいくるみ,Kumagai Kurumi,くまがい,くるみ,3,厚生,24A6043,工学部,応用化学科,3,2005/8/6,https://drive.google.com/uc?export=view&id=1EfSRG4doOn8nvr2fooJJvYKpsiyCWkxS
s24C2047BA@chibatech.ac.jp,齋藤蒼天,齋藤,蒼天,さいとうそら,Saito Sora,さいとう,そら,3,厚生,24C2047,先進工学部,生命科学科,3,2006/3/2,https://drive.google.com/uc?export=view&id=1PnNWziyTPYRIFDoTDW0EV-I7zwIwwyK4
s24C2070GD@chibatech.ac.jp,高島春香,高島,春香,たかしまはるか,Takashima Haruka,たかしま,はるか,3,厚生,24C2070,先進工学部,生命科学科,3,2006/1/25,https://drive.google.com/uc?export=view&id=1eaADKb7UOBGTyPhoaqWw7NmdnklDRuQx
s24C3105YL@chibatech.ac.jp,廣瀬雅人,廣瀬,雅人,ひろせまさと,Masato Hirose,ひろせ,まさと,3,厚生,24C3105,先進工学部,知能メディア工学科,3,2005/5/2,https://drive.google.com/uc?export=view&id=18PDfnoysC8gZgN7BfbK2qNxK4BYj3mic
s25g2043xd@chibatech.ac.jp,金成永樹,金成,永樹,かなりえいき,Quite good,かなり,えいき,2,厚生,25G2043,情報変革科学部,認知情報科学科,2,2006/7/16,https://drive.google.com/uc?export=view&id=13g1CYadWidNEKEFsc_szKuddR-auO6mQ
s24c3044mj@chibatech.ac.jp,近藤優大,近藤,優大,こんどうゆうた,Kondo Yuta,こんどう,ゆうた,2,厚生,24C3044,先進工学部,知能メディア工学科,3,2004/4/30,https://drive.google.com/uc?export=view&id=1_nbXOfd721xHxH9MjeEJH2gKhu9Qb5jn
s25g2097ky@chibatech.ac.jp,西谷実莉,西谷,実莉,にしたにみのり,Nishitani Minori,にしたに,みのり,2,厚生,25G2097,情報変革科学部,認知情報科学科,2,2006/12/11,https://drive.google.com/uc?export=view&id=1FhqqkxH6u6gMd8SVzP9tz-eRULLqnEkk
s25g3107xe@chibatech.ac.jp,橋本光明,橋本,光明,はしもとみつあき,Hashimoto Mitsuaki,はしもと,みつあき,2,厚生,25G3107,情報変革科学部,高度応用情報科学科,2,2007/2/20,https://drive.google.com/uc?export=view&id=1ELv4VyHqAUHmWyuWmyHdWvN-_I65CxuL
s26g1015db@chibatech.ac.jp,石川陽史,石川,陽史,いしかわはるふみ,Harufumi Ishikawa,いしかわ,はるふみ,1,厚生,26G1015,情報変革科学部,情報工学科,1,2006/05/21,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26a4033ae@chibatech.ac.jp,大槻悠斗,大槻,悠斗,おおつき　ゆうと,Otsuki Yuto,おおつき,ゆうと,1,厚生,26A4033,工学部,電気電子工学科,1,2007/09/08,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26a4085te@chibatech.ac.jp,杉山雄也,杉山,雄也,すぎやまゆうや,Yuya Sugiyama,すぎやま,ゆうや,1,厚生,26A4085,工学部,電気電子工学科,1,2007/01/29,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26g3094tm@chibatech.ac.jp,田邉蒼太,田邉,蒼太,たなべそうた,Tanabe Sota,たなべ,そうた,1,厚生,26G3094,情報変革科学部,高度応用情報科学科,1,2008/01/05,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s23B1015nd@chibatech.ac.jp,上野瑛,上野,瑛,うえのあきら,Akira Ueno,うえの,あきら,4,企画,23B1015,創造工学部,建築学科,4,2004/4/2,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s2332071nq@chibatech.ac.jp,佐藤優真,佐藤,優真,さとうゆうま,Sato Yuma,さとう,ゆうま,4,企画,2332071,情報科学部,情報ネットワーク学科,4,2004/10/22,https://drive.google.com/uc?export=view&id=1fSb4pP0SPYIMuUbtVOj3q5L4tVB3Pgs5
s23B2069hb@chibatech.ac.jp,篠塚隼佑,篠塚,隼佑,しのづかしゅんすけ,Shinozuka Shunsuke,しのづか,しゅんすけ,4,企画,23B2069,創造工学部,都市環境工学科,4,2003/8/6,https://drive.google.com/uc?export=view&id=1Nrqtqsykyz-Snl_h3f6bRQ_sBl2PN5xr
s2331107yq@chibatech.ac.jp,内藤優稀,内藤,優稀,ないとうゆうき,Naito Yuuki,ないとう,ゆうき,4,企画,2331107,情報科学部,情報工学科,4,2004/12/28,https://drive.google.com/uc?export=view&id=1gaLcei7MvhHxTGioosV00ZJiVD7aRS2v
s2341098kg@chibatech.ac.jp,中西凜,中西,凜,なかにしりん,Nakanishi Rin,なかにし,りん,4,企画,2341098,社会システム科学部,経営情報科学科,4,2004/12/26,https://drive.google.com/uc?export=view&id=1wC-8n8tE7qQ1HNHXU0Zh4wQLphI1rEmX
s2342105sg@chibatech.ac.jp,林朋花,林,朋花,はやしともか,Hayashi Tomoka,はやし,ともか,4,企画,2342105,社会システム科学部,プロジェクトマネジメント学科,4,2005/1/19,https://drive.google.com/uc?export=view&id=1smeqgo1Fj9Fri0pi-XajXyiM8qAmrPD3
s24C2050TX@chibatech.ac.jp,坂本こよみ,坂本,こよみ,さかもとこよみ,Sakamoto Koyomi,さかもと,こよみ,3,企画,24C2050,先進工学部,生命科学科,3,2004/12/5,https://drive.google.com/uc?export=view&id=16cUry58Bg_Ffs-fgmVaE_pRudy4ewUPr
s24C3052MW@chibatech.ac.jp,鷺坂のの,鷺坂,のの,さぎさかのの,Sagisaka Nono,さぎさか,のの,3,企画,24C3052,先進工学部,知能メディア工学科,3,2006/2/13,https://drive.google.com/uc?export=view&id=1Ss-aNLpw2wBrbU3cs85bTvwtbDRcUwTM
s24C3053zw@chibatech.ac.jp,櫻井康佑,櫻井,康佑,さくらいこうすけ,Kosuke Sakurai,さくらい,こうすけ,3,企画,24C3053,先進工学部,知能メディア工学科,3,2005/9/15,https://drive.google.com/uc?export=view&id=1P6T3xyj9VGH1Fid7esThPGBWpjn5D2X0
s24C2056AV@chibatech.ac.jp,佐々木るな,佐々木,るな,ささきるな,Sasaki Runa,ささき,るな,3,企画,24C2056,先進工学部,生命科学科,3,2005/6/11,https://drive.google.com/uc?export=view&id=1ROoHd0rt7wVj_UBrlCzzZHJmlW_BZtn5
s24C2117AU@chibatech.ac.jp,村山夕輔,村山,夕輔,むらやまゆうすけ,Yusuke Murayama,むらやま,ゆうすけ,3,企画,24C2117,先進工学部,生命科学科,3,2005/7/7,https://drive.google.com/uc?export=view&id=1R9aJ2sXblHp-jFn3tk8t1L3hIJQv1NSo
s25k1018cm@chibatech.ac.jp,岩瀬晴香,岩瀬,晴香,いわせはるか,Iwase Haruka,いわせ,はるか,2,企画,25K1018,未来変革科学部,デジタル変革科学科,2,2006/9/5,https://drive.google.com/uc?export=view&id=1YMFtpmTmNMyUNIeGJt87ybmFlhHXAah0
s25k2013st@chibatech.ac.jp,遠藤暖斗,遠藤,暖斗,えんどうはると,Endo Haruto,えんどう,はると,2,企画,25K2013,未来変革科学部,経営デザイン科学科,2,2006/4/23,https://drive.google.com/uc?export=view&id=1Z-L5qZ0QLZdrHRsMPmEAgesFM6P42pR2
s25a4024bf@chibatech.ac.jp,大石知弥,大石,知弥,おおいしともや,Oishi Tomoya,おおいし,ともや,2,企画,25A4024,工学部,電気電子工学科,2,2006/4/8,https://drive.google.com/uc?export=view&id=1FsNEG52I8HtfCShko0EUopxzYwuf-pJX
s25b1049kh@chibatech.ac.jp,川野紗和,川野,紗和,かわのさわ,Kawanosawa,かわの,さわ,2,企画,25B1049,創造工学部,建築学科,2,2006/11/19,https://drive.google.com/uc?export=view&id=14lZ_m9xFMYWxNXsRFWXUXZvQJnOeDe4t
s25a6105ac@chibatech.ac.jp,前田旺佑,前田,旺佑,まえだおうすけ,Maeda Osuke,まえだ,おうすけ,2,企画,25A6105,工学部,応用化学科,2,2006/10/14,https://drive.google.com/uc?export=view&id=1tpGslg2cItqOfPBIfa9JttU6CqrV9jye
s25c2116dw@chibatech.ac.jp,松尾仁湖,松尾,仁湖,まつおにこ,Matsuo Niko,まつお,にこ,2,企画,25C2116,先進工学部,生命科学科,2,2006/6/14,https://drive.google.com/uc?export=view&id=1HKDYMYsyTdRDQeyAFhiccdZdHgy7U0DK
s25b1150er@chibatech.ac.jp,矢田逞,矢田,逞,やだたくま,Yada Takuma,やだ,たくま,2,企画,25B1150,創造工学部,建築学科,2,2007/1/5,https://drive.google.com/uc?export=view&id=1EwrxwPkA4Cfg4LyG7H8Z1N70UOEDpaJR
s26k1045rg@chibatech.ac.jp,鬼頭功樹,鬼頭,功樹,きとうこうき,Kitou Kouki,きとう,こうき,1,企画,26K1045,未来変革科学部,デジタル変革科学科,1,2008/03/09,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26g2038dn@chibatech.ac.jp,木村友哉,木村,友哉,きむらともや,Tomoya Kimura,きむら,ともや,1,企画,26G2038,情報変革科学部,認知情報科学科,1,2007/11/18,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26g1103fk@chibatech.ac.jp,馬場幸希,馬場,幸希,ばばこうき,Baba Kouki,ばば,こうき,1,企画,26G1103,情報変革科学部,情報工学科,1,2008/02/15,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link
s26k2076ha@chibatech.ac.jp,早川未桜,早川,未桜,はやかわみお,Hayakawa Mio,はやかわ,みお,1,企画,26K2076,未来変革科学部,経営デザイン科学科,1,2008/03/04,https://drive.google.com/drive/folders/1M72MunlCSUVRP0kyylAgXQuG-uPLunH2VIRscfbNUFwyfLnPWo-lUvbBnuoc3TKkoxRqjuFz?usp=drive_link`;

const lines = rawCsv.trim().split('\n');
const header = lines[0].split(',');

const members = [];

// かなからローマ字への簡易変換ヘルパー（姓と名の間スペース含む）
const kanaToRomajiMap = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'si', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'ti', 'つ': 'tu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'hu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'nn',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'zi', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sya', 'しゅ': 'syu', 'しょ': 'syo',
  'ちゃ': 'tya', 'ちゅ': 'tyu', 'ちょ': 'tyo',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'zya', 'じゅ': 'zyu', 'じょ': 'zyo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  'ー': '-'
};

function kanaToRomaji(kana) {
  let res = '';
  let i = 0;
  while (i < kana.length) {
    if (i + 1 < kana.length) {
      const two = kana.substr(i, 2);
      if (kanaToRomajiMap[two]) {
        res += kanaToRomajiMap[two];
        i += 2;
        continue;
      }
    }
    const one = kana[i];
    if (one === 'っ') {
      // 次の文字の子音
      let nextKana = kana.substr(i + 1, 2);
      let rNext = kanaToRomajiMap[nextKana] || kanaToRomajiMap[kana[i + 1]] || '';
      if (rNext) {
        res += rNext[0];
      } else {
        res += 'xtsu';
      }
      i++;
      continue;
    }
    if (kanaToRomajiMap[one]) {
      res += kanaToRomajiMap[one];
    } else {
      res += one;
    }
    i++;
  }
  return res;
}

for (let idx = 1; idx < lines.length; idx++) {
  const row = lines[idx].split(',');
  if (row.length < 15) continue;

  const email = row[0].trim();
  const nameKanji = row[1].trim();
  const lastNameKanji = row[2].trim();
  const firstNameKanji = row[3].trim();
  const kanaFull = row[4].trim().replace(/\s+/g, '');
  const rawRomaji = row[5] ? row[5].trim() : '';
  const myoujiKana = row[6].trim().replace(/\s+/g, '');
  const namaeKana = row[7].trim().replace(/\s+/g, '');
  const grade = parseInt(row[8].trim(), 10) || 1;
  const dept = row[9].trim();
  const studentId = row[10].trim();
  const faculty = row[11].trim();
  const department = row[12].trim();
  const birth = row[14].trim();
  const photoUrl = row[15] ? row[15].trim() : '';

  // 名字と名前の間にスペースを入れたかな
  const kanaSpaced = `${myoujiKana} ${namaeKana}`;
  
  // ひらがなから正確な標準ローマ字を生成（名字 名前）
  const romaji = `${kanaToRomaji(myoujiKana)} ${kanaToRomaji(namaeKana)}`;

  // photo_url からDrive IDの抽出
  let driveId = '';
  let driveUrls = [];
  if (photoUrl.includes('id=')) {
    const match = photoUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (match) {
      driveId = match[1];
      driveUrls.push(driveId);
    }
  }

  members.push({
    id: studentId,
    kanji: nameKanji,
    last_name: lastNameKanji,
    first_name: firstNameKanji,
    kana: kanaSpaced,
    kana_full: kanaFull,
    romaji: romaji,
    grade: grade,
    dept: dept,
    student_id: studentId,
    faculty: faculty,
    department_name: department,
    birth: birth,
    photo_url: photoUrl,
    drive_id: driveId,
    drive_urls: driveUrls
  });
}

fs.writeFileSync('data/members.json', JSON.stringify(members, null, 2));

const mockDataJs = `/**
 * 学友打（がくゆうだ！）マスターデータ & モックデータ
 * GAS連携前やオフライン時にも完全に動作します。
 */
window.INITIAL_MEMBERS = ${JSON.stringify(members, null, 2)};

window.INITIAL_RANKINGS = [
  { player_name: "坂井綾太", player_dept: "福祉", score: 1850, accuracy: 98.4, timestamp: "2026-09-01 12:00" },
  { player_name: "福原出雲", player_dept: "福祉", score: 1720, accuracy: 96.8, timestamp: "2026-09-01 14:30" },
  { player_name: "川上丈琉", player_dept: "総務", score: 1650, accuracy: 95.2, timestamp: "2026-09-01 16:15" },
  { player_name: "佐藤志帆", player_dept: "渉外", score: 1580, accuracy: 97.1, timestamp: "2026-09-01 18:00" },
  { player_name: "石川夏輝", player_dept: "財務", score: 1520, accuracy: 94.5, timestamp: "2026-09-01 19:20" },
  { player_name: "北村界翔", player_dept: "広報", score: 1490, accuracy: 93.0, timestamp: "2026-09-02 10:10" },
  { player_name: "青木遼斗", player_dept: "厚生", score: 1430, accuracy: 91.8, timestamp: "2026-09-02 11:45" },
  { player_name: "林朋花", player_dept: "企画", score: 1380, accuracy: 96.0, timestamp: "2026-09-02 13:00" }
];
`;

fs.writeFileSync('js/mock-data.js', mockDataJs);
console.log(\`Successfully generated data/members.json and js/mock-data.js with \${members.length} members.\`);
