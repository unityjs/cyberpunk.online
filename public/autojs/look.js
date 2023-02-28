"ui";

var color = "#009688";

ui.layout(
    // 抽屉布局，左边那个抽屉
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="Look红包助手 v1.0" />
            </appbar>
            <ScrollView>
                <vertical padding="16">
                    <Switch id="followHongbao" text="领取关注红包" marginTop="10" />
                    <horizontal>
                        <text text="点击间隔（毫秒）" inputType="number" textColor="black" />
                        <input id="delta" inputType="number" textColor="gray" w="100" />
                    </horizontal>
                    <horizontal>
                        <text text="每" inputType="number" textColor="black" />
                        <input id="roundCount" inputType="number" textColor="gray" w="50" />
                        <text text="轮红包间隔" inputType="number" textColor="black" />
                        <input id="roundDelta" inputType="number" textColor="gray" w="50" />
                        <text text="分" inputType="number" textColor="black" />
                    </horizontal>
                    <button id="ok" text="开始抢红包" style="Widget.AppCompat.Button.Colored" w="*" marginTop="30" />
                </vertical>
            </ScrollView>
        </vertical>

        <vertical layout_gravity="left" bg="#ffffff" w="280">
            <img w="280" h="100" scaleType="fitXY" src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg" />
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}" />
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" />
                </horizontal>
            </list>
        </vertical>
    </drawer>
);

activity.setSupportActionBar(ui.toolbar);

ui.toolbar.setupWithDrawer(ui.drawer);

ui.menu.setDataSource([
    {
        title: "恢复默认设置",
        icon: "@drawable/ic_android_black_48dp"
    },
    {
        title: "日志",
        icon: "@drawable/ic_find_in_page_black_48dp"
    },
    {
        title: "系统设置",
        icon: "@drawable/ic_settings_black_48dp"
    },
    {
        title: "关于",
        icon: "@drawable/ic_favorite_black_48dp"
    },
    {
        title: "退出",
        icon: "@drawable/ic_exit_to_app_black_48dp"
    }
]);


// 退出软件的方法
ui.menu.on("item_click", item => {
    switch (item.title) {
        case "日志": app.startActivity("console"); break;
        case "系统设置": app.startActivity("settings"); break;
        case "关于":
            dialogs.build({
                title: "关于",
                content: "本软件基于Auto.js编写，仅作学习和交流之用，不得商业使用及非法使用，否则一切后果自付\n此为免费软件，如您从其他途径获得，谨防病毒木马\n如有疑问及后续更新请联系开发者\n\n当前版本 : v3.0.0\n开发者微信 : zhss668",
                neutral: "去微信",
                positive: "确定",
                neutralColor: color,
                positiveColor: color,
            }).on("neutral", () => {
                setClip("zhss668");
                toast("已复制开发者微信号（zhss668）到剪切板");
                launch("com.tencent.mm");
            }).show();
            break;
        case "退出":
            ui.finish();
            break;
    }
})

let storage = storages.create("look");
ui.followHongbao.on("check", function (checked) {
    storage.put("followHongbao", checked);
});
ui.followHongbao.checked = storage.get("followHongbao", true);
ui.delta.setText(storage.get("delta", "300"));
ui.roundCount.setText(storage.get("roundCount", "9"));
ui.roundDelta.setText(storage.get("roundDelta", "30"));

let threadWork;
let totleGold = 0;
let roundList = [];
ui.ok.click(function () {
    if (threadWork && threadWork.isAlive()) {
        ui.ok.setText("开始抢红包");
        threadWork.interrupt();
        threadWork = null;
        console.info('已停止抢红包');
    } else {

        let delta = parseInt(ui.delta.getText()) || 0;
        let roundCount = parseInt(ui.roundCount.getText()) || 0;
        let roundDelta = parseInt(ui.roundDelta.getText()) || 0;
        storage.put("delta", ui.delta.getText().toString());
        storage.put("roundCount", ui.roundCount.getText().toString());
        storage.put("roundDelta", ui.roundDelta.getText().toString());

        function getHongbaoInfo() {
            roundList.push(Date.now());
            let resultGold = 0;
            let text = id("com.netease.play:id/resultGold").findOne().text().toString();
            let r = /(\d+) 音符/.exec(text);
            if (r) {
                resultGold = parseInt(r[1]);
                totleGold += resultGold;
                let totle = 1;
                r = /红包共(\d+)音符/.exec(id("com.netease.play:id/luckyMoneyInfo").findOne().text());
                if (r) totle = parseInt(r[1]);
                console.log("红包共" + totle + "音符，抢到" + resultGold + "音符，累计" + totleGold + "音符");
            }
            else if (text == "没有抢到红包") console.error("没有抢到红包，账号可能已被限制！");
            else console.log(text);
        }
        function startWork() {
            try {
                //let countDownText;
                while (true) {
                    if (id("com.netease.play:id/resultGold").exists()) {
                        getHongbaoInfo();
                        sleep(1000);
                        id("com.netease.play:id/closeButton").findOne().click();
                        sleep(1000);
                        break;
                    }

                    if (ui.followHongbao.checked && id("com.netease.play:id/button").text("关注主播并领取").exists()) {
                        id("com.netease.play:id/button").text("关注主播并领取").findOne().click();
                        //sleep(500);
                        sleep(1000);
                        continue;
                    }

                    if (id("com.netease.play:id/openButton").exists()) {
                        let btn = id("com.netease.play:id/openButton").findOne();
                        /*if(countDownText!=btn.text()){
                            countDownText = btn.text();
                            console.log(countDownText);
                        }*/
                        btn.click();
                        if (delta > 0) sleep(delta);
                        /*else if (btn.text() == "抢") {
                            
                        }
                        if (btn.text() == "抢") {
                            btn.click();
                            sleep(500);
                            getHongbaoInfo();
                            sleep(1000);
                            break;
                        }*/
                        continue;
                    }

                    if (id("com.netease.play:id/luckyMoneyEntryContainer").exists()) {
                        if (ui.followHongbao.checked || id("com.netease.play:id/luckyMoneyEntryContainer").findOne().findOne(text("立即抢")) == null) {
                            let btn = id("com.netease.play:id/luckyMoneyEntryContainer").findOne();
                            btn.click();
                            //console.log(btn.text());
                            //console.log("开始红包倒计时");
                            sleep(1000);
                            continue;
                        }
                    }

                    if (id("com.netease.play:id/liveNotice").textContains("红包将在60s后降落直播间").exists()) {
                        let r = /(.+) 在 (.+) 的直播间赠送了 (.+) ，红包将在(\d+)s后降落直播间！/.exec(id("com.netease.play:id/liveNotice").findOne().text());
                        if (r) {
                            console.log("前往" + r[2] + "的直播间");
                        }
                        let btn = id("com.netease.play:id/liveNoticeContainer").findOne();
                        sleep(1000);
                        btn.click();
                        sleep(1000);
                        continue;
                    }

                    sleep(1000);
                }
            } catch (e) { console.error(e); }
        }

        if (auto.service == null) {
            ui.ok.setText("请开启无障碍服务");
            toast("请先开启无障碍服务！");
            app.startActivity({ action: "android.settings.ACCESSIBILITY_SETTINGS" });
        }

        threadWork = threads.start(function () {
            while (auto.service == null) sleep(1000);
            ui.ok.setText("停止抢红包");
            console.show();
            console.log('准备抢红包...');
            while (true) {
                startWork();
                if (roundList.length >= roundCount) {
                    let roundTime = roundList.shift();
                    let delta = Date.now() - roundTime;
                    let offset = roundDelta * 60000 - delta;
                    if (offset > 0) {
                        console.error('红包抢的过于激烈，请休息' + (Math.floor(offset / 60000) + 1) + '分钟');
                        sleep(offset);
                    }
                }
                console.log('准备下一轮红包...');
                sleep(1000);
            }
            console.log('抢红包结束');
            ui.ok.setText("开始抢红包");
        });
    }
})