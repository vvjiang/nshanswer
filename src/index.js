import $ from 'jquery'
import _ from 'lodash'
import './index.css'
import { questionLib, clueQuestionLib, poemQuestionLib } from './question'

/**
 * 隐藏百度Iframe
 */
const hideBaidu = () => {
  $('#baidu_iframe').hide();
}
/**
 * 百度此关键字
 */
const searchInBaidu = (searchText) => {
  var url = 'https://m.baidu.com/s?word=逆水寒+科举+';
  var question_type = $('#radio_question_type input:checked').val()
  if (question_type == 'poem') {
    url = 'https://m.baidu.com/s?word=诗词+';
  }
  $('#baidu_iframe').attr('src', url + searchText).show()
}
/**
 * 展示百度搜索的按钮
 */
const showBtnBaidu = (searchText) => {
  $('#btn_baidu').show()
}
/**
 * 隐藏百度搜索的按钮
 */
const hideBtnBaidu = (searchText) => {
  $('#btn_baidu').hide()
}
/**
 * 清除搜索结果
 */
const clearSearchResult = () => {
  $('#search_result').empty()
  hideBaidu()
  hideBtnBaidu()
}
/**
 * 搜索常规答案
 */
const searchNormalAnswer = (searchText) => {
  var result = questionLib.filter(l => {
    return new RegExp(searchText).test(l.question)
  });
  if (result.length === 0) {
    searchInBaidu(searchText)
    return
  }
  if (result.length < 5) {
    showBtnBaidu()
  }
  var htmlResult = result.slice(0, 10).map((x) => {
    return `<li><p><span class="label label-danger">问</span><span>${x.question}</span></p><p><span class="label label-success">答</span><span>${x.answer}</span></p></li>`
  }).join('')
  $('#search_result').empty().append(htmlResult)
}
/**
 * 搜索填诗题答案
 */
const searchPoemAnswer = (searchText) => {
  var keys = searchText.split('');
  var result = poemQuestionLib.filter(l => {
    for (var i = 0, len = keys.length; i < len; i++) {
      if (!(new RegExp(keys[i]).test(l.question))) {
        return false
      }
    }
    return true
  })
  if (result.length === 0) {
    searchInBaidu(searchText)
    return
  }
  if (result.length < 5) {
    showBtnBaidu(searchText)
  }
  var htmlResult = result.map((x) => {
    return `<li><p><span class="label label-danger">问</span><span>${x.question}</span></p><p><span class="label label-success">答</span><span>${x.answer}</span></p></li>`
  }).join('')
  $('#search_result').empty().append(htmlResult)
}
/**
 * 搜索线索题答案
 */
const searchClueAnswer = (searchText) => {
  var result = clueQuestionLib.filter(l => {
    return new RegExp(searchText).test(l.question)
  })
  if (result.length === 0) {
    searchInBaidu(searchText)
    return
  }
  if (result.length < 5) {
    showBtnBaidu(searchText)
  }
  var htmlResult = result.slice(0, 10).map((x) => {
    return `<li><p><span class="label label-danger">问</span><span>线索题</span><pre>${x.question}</pre></p><p><span class="label label-success">答</span><span>${x.answer}</span></p></li>`
  }).join('')
  $('#search_result').empty().append(htmlResult)
}
/**
 * 搜索答案
 */
const searchAnswer = _.throttle(() => {
  clearSearchResult()
  var searchText = $('#search_text').val()
  if (searchText === '') {
    return
  }
  var question_type = $('#radio_question_type input:checked').val()
  if (question_type == 'normal') {
    searchNormalAnswer(searchText)
  } else if (question_type == 'poem') {
    searchPoemAnswer(searchText)
  } else if (question_type == 'clue') {
    searchClueAnswer(searchText)
  }
}, 1000)

$(function () {
  // 点击搜索
  $('#btn_search').off('click').click(searchAnswer);
  $('#search_text').off('keypress').keypress((e) => {
    if (e.key === 'Enter') {
      searchAnswer();
    }
  });
  // 点击百度搜索的按钮
  $('#btn_baidu').click(() => {
    hideBtnBaidu()
    $('#search_result').empty()
    searchInBaidu($('#search_text').val())
  })
})
// 切换题型时清空内容
$('#radio_question_type input[type=radio][name=questionType]').change(function () {
  clearSearchResult()
})







