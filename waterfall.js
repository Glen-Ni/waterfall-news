let waterfall = {
  init: function() {
    this.curPage = 1
    this.perPageCount = 30
    this.isLoading = false
    this.colHeightArr = []
    this.itemWidth = 0
    this.leftOffset = 0 // 为了居中，只能加载后算一下水平偏移量
    // this.itemWidth = $('.container .item').outerWidth(true)
    // this.colCount= Math.floor($('.waterfall').width() / this.itemWidth)
    this.bind()
    this.start()
  },
  bind: function() {
    let _this = this
    let timer1 = null
    $(window).on('scroll', () => {
      if (timer1) {
        window.clearTimeout(timer1)
      }
      timer1 = setTimeout(() => {
        if (_this.isShown($('div.load'))) {
          _this.start()
          console.log('scroll loading···')
        }
      }, 300)
    })
    let timer2 = null
    $(window).on('resize', () => {
      if (timer2) {
        window.clearTimeout(timer2)
      }
      timer2 = setTimeout(() => {
        _this.colHeightArr = []
        _this.itemWidth = $('.container .item').outerWidth(true)
        console.log($('.container').width())
        const colCount = Math.floor(
          $('.container').width() / _this.itemWidth
        )
        _this.leftOffset =
              ($('.container').width() % _this.itemWidth) / 2
        for (let i = 0; i < colCount; i++) {
          _this.colHeightArr.push(0)
        }
        $('.container .item').each(function() {
          _this.layout($(this))
        })
      }, 300)
    })
  },
  start: function() {
    this.getData(this.render)
  },
  getData: function(callback) {
    let _this = this
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    $.ajax({
      url: 'http://platform.sina.com.cn/slide/album_tech',
      type: 'get',
      dataType: 'jsonp',
      jsonp: 'jsoncallback',
      data: {
        app_key: '1271687855',
        format: 'json',
        size: 'img',
        num: _this.perPageCount,
        page: _this.curPage
      },
      success: function(ret) {
        // console.log(ret)
        if (ret.status.code == 0) {
          let $nodes = callback(ret.data)
          // console.log(ret.data)
          _this.isLoading = false
          _this.curPage++

          // 第一次添加到dom后才能获取item的宽度
          if (_this.colHeightArr.length === 0) {
            _this.itemWidth = $('.container .item').outerWidth(true)
            console.log($('.container').width())
            console.log(_this.itemWidth)
            const colCount = Math.floor(
              $('.container').width() / _this.itemWidth
            )
            _this.leftOffset =
              ($('.container').width() % _this.itemWidth) / 2
            for (let i = 0; i < colCount; i++) {
              _this.colHeightArr.push(0)
            }
            console.log(_this.colHeightArr)
          }
          $nodes.find('img').on('load', function() {
            let $item = $(this).parents('li.item')
            // console.log($item)
            _this.layout($item)
          })
        }
      },
      fail: function (textStatus) {
        console.log(textStatus)
      }
    })
  },
  render: function(data) {
    console.log(data)
    let html = ''
    let _this = this
    console.log(this)
    data.forEach(function(item) {
      html += `
        <li class="item">
          <a href="${item.url}" class="link">
            <img src="${item.img_url}" alt="${
        item.short_name
      }" height="${Math.floor(Math.random() * 220 + 120)}" />
          </a>
          <h4>${item.short_name}</h4>
        </li>
        `
    })
    let $nodes = $(html)
    $('.container ul').append($nodes)
    return $nodes
  },
  layout($node) {
    let minIndex = 0
    let minValue = this.colHeightArr[minIndex]
    for (let i = 0; i < this.colHeightArr.length; i++) {
      if (this.colHeightArr[i] < minValue) {
        minValue = this.colHeightArr[i]
        minIndex = i
      }
    }
    $node.css({
      left: this.itemWidth * minIndex + this.leftOffset,
      top: minValue
    })
    $node.show()
    this.colHeightArr[minIndex] += $node.outerHeight(true)
    $('.load').css('top', this.colHeightArr[minIndex])
  },
  isShown: function() {
    return (
      $('div.load').offset().top - 10 <
      $(window).scrollTop() + $(window).height()
    )
  }
}