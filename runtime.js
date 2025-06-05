function whenDOMReady() {
  marcus.randomLink();
}

var marcus = {
  saveData: (key, value) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        time: Date.now(),
        data: value
      })
    );
  },

  loadData: (key, minutes) => {
    let stored = JSON.parse(localStorage.getItem(key));
    if (stored) {
      let delta = Date.now() - stored.time;
      if (delta > -1 && delta < 60000 * minutes) {
        return stored.data;
      }
    }
    return 0;
  },

  runtime: () => {
    const pad = (n) => (n > 9 ? n : "0" + n);
    let startTime = new Date("2022/08/09 00:00:00").getTime();
    let nowTime = new Date().getTime();
    let seconds = Math.round((nowTime - startTime) / 1000);

    let output = "本站已运行：";

    if (seconds >= 86400) {
      output += pad(parseInt(seconds / 86400)) + " 天 ";
      seconds %= 86400;
    }
    if (seconds >= 3600) {
      output += pad(parseInt(seconds / 3600)) + " 时 ";
      seconds %= 3600;
    }
    if (seconds >= 60) {
      output += pad(parseInt(seconds / 60)) + " 分 ";
      seconds %= 60;
    }
    if (seconds >= 0) {
      output += pad(seconds) + " 秒";
    }

    let el = document.getElementById("runtime");
    if (el) el.innerHTML = output;

    setTimeout(marcus.runtime, 1000);
  },

  randomLink: () => {
    let data = marcus.loadData("links", 30);
    if (data) {
      let items = document.querySelectorAll("#friend-links-in-footer .footer-item");
      if (!items.length) return;

      for (let i = 0; i < 5; i++) {
        let idx = parseInt(Math.random() * data.length);
        items[i].innerText = data[idx].name;
        items[i].href = data[idx].link;
        data.splice(idx, 1); // 避免重复
      }
    } else {
      fetch("/link.json")
        .then((res) => res.json())
        .then((json) => {
          marcus.saveData("links", json.link_list);
          marcus.randomLink();
        });
    }
  }
};

// 启动运行时间计时器
marcus.runtime();
