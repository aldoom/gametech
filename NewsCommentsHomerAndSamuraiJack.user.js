// ==UserScript==
// @name         Удобные новости, красивые комментарии, читабельный текст
//               Полный список новостей на главной странице
// @namespace    pigForHomerNews
// @include     http://www.gametech.ru/*
// @author       Erik Vergobbi Vold & Tyler G. Hicks-Wright & pigForHomer & SamuraiJackGT
// @description  PigForHomer&SamuraiJack: Делаем gametech удобнее
// @version     3.9
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "/resources/js/jquery-1.7.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
    /* last comment in our news table*/
    window.lastCommentsShow = function(onNewsPage) {
        $('table.news_shortlist a, div.news_list .item h3 a').each(function(){
            var self = $(this);
            var newsId = self.attr('href');
            if (newsId.indexOf("comments_block") == -1) {
                newsId = newsId.match(/\d+/gi);
                newsId = newsId[0];
                $.post(
                    'http://www.gametech.ru/cgi-bin/comments.pl',
                    {
                        action : 'ajax',
                        id : newsId,
                        option : 'news',
                        sub_option : 'refresh'
                    },
                    function(res){
                        if(res.status == 'ok') {
                            var lastComment = $(res.content).find('.commentaries .item:first');
                            var userName = lastComment.find('a.username');
                            userName.find('img').remove();
                            userName = userName.html();
                            if (userName != null) {
                                if (onNewsPage) {
                                    var commentTime = lastComment.find('span.date').html();

                                    var commentString = '<span style="display:block;color:#5D5D5D;">Последний комментарий от '+userName+' '+commentTime+'</span>';
                                    self.parents('.item').append(commentString);
                                } else {
                                    var commentTime = lastComment.find('span.date').html();
                                    commentTime = commentTime.substr((commentTime.indexOf(',')+1));

                                    var commentString = '<span style="display:block;color:#5D5D5D;">'+userName+''+commentTime+'</span>';
                                    self.parent('td').append(commentString);
                                }
                            }
                        }
                    },
                    'json'
                );
            }
        });
    }
    
 if (!(window.location=='http://www.gametech.ru/')){
    var ourTableShortList=$('table.news_shortlist');
    var startPositionForRightNews=$('div.user_logined_block')[0] || $('div.auth_actions')[0];
    $('#ri_reviews').insertAfter(startPositionForRightNews);
    ourTableShortList.insertAfter(startPositionForRightNews);
    $('h2.news').css({'color':'#487099', 'text-decoration':'underline'}).insertAfter(startPositionForRightNews);
    ourTableShortList.find('tr td:first-child').remove();
        var linkInTableTd=ourTableShortList.find('tr td a');
        for(var i=0;i<linkInTableTd.length;i++){
            if(linkInTableTd[i].href==window.location){
                linkInTableTd[i].parentNode.setAttribute('style','padding:5px; background:#48a2de;border-radius:5px;');
                linkInTableTd[i].setAttribute('style','color:white;text-decoration:none')
            }
        }
        var spanInTableTd=ourTableShortList.find('span.comments');
        spanInTableTd.find('i').remove();
        for(var j=0;j<spanInTableTd.length;j++){
            spanInTableTd[j].setAttribute('style','padding:0px');
        }

    function spacesForTags(txt){
        txt.replace("<b>", " <b>");
        txt.replace("<i>", " <i>");
        txt.replace("<noindex>", " <noindex>");
        txt.replace("</b>", "</b> ");
        txt.replace("</i>", "</i> ");
        txt.replace("</noindex>", "<noindex> ");
    };


    $('.news_list .item').css('font-size', '14px');
    $('.news_list .item h3').css({'font-size':'17px','font-weight':'bold'});
    $('div.g960').css({'background': '#F9FBFB','font-family':'Verdana'});
    $('.news_list .commentaries .item div.spoiler').css('background', '#F9FBFB');
     $('.news_list .item .clear').css({'border': 'none'});
     $('.news_list .item div.offtopic').css({'font-size': '12px !important'});
     $('.news_list .item div.offtopic .reply, .news_list .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'border': 'none !important'});
     $('.news_list .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'color':'#444444'});
     $('.commentaries .item .head').css({'height': '20px','background':'#dbe7ef','margin': '25px 0 25px 0'});
     $('.commentaries .item .head .userpic').css({'background':'#dbe7ef','width':'50px','height':'50px', 'top': '-20px', 'padding':'3px','borderRadius':'3px','border':'1px solid #dbe7ef'});
     $('.commentaries .item .head .username').css({'padding-left':'60px','display':'inline-block','padding-top':'0px'});
     $('.commentaries .item .body .reply').css({'margin':'0px','borderRadius':'3px'});
     $('div.offtopic').css({'background-color':'#EDEDED','border':'1px solid #CDCDCD','color':'#ADADAD','padding':'2px'}).removeClass('offtopic');
     $('.commentaries .item .body noindex, .commentaries .item .body b, .commentaries .item .body i').css({'padding':'5px'});
     //$('.commentaries .item .body').each(function(){var txt = $(this).html();spacesForTags(txt);});
     //$('.comment_user_text').each(function(){var txt = $(this).html();spacesForTags(txt);});
     
     $('.news_shortlist a').css({'font-size':'12px'});
     $('.right_block_content div.item a, .right_block_content h3 a').css({'font-size':'12px'});
     
     /* spoiler div styles*/
     $('div.spoiler').css({'font-size':'12px'});
     $('div#comments_block_place').live('DOMNodeInserted', function(){
         $('.news_list .commentaries .item').css('font-size', '14px');
         $('.news_list .commentaries .item .clear').css({'border': 'none'});
         $('.news_list .commentaries .item div.offtopic').css({'font-size': '12px !important'});
         $('.news_list .commentaries .item div.offtopic .reply, .news_list .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'border': 'none !important'});
         $('.news_list .commentaries .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'color':'#444444'});
         $('.commentaries .item .head').css({'height': '20px','background':'#dbe7ef','margin': '25px 0 25px 0'});
         $('.commentaries .item .head .userpic').css({'background':'#dbe7ef','width':'50px','height':'50px', 'top': '-20px', 'padding':'3px','borderRadius':'3px','border':'1px solid #dbe7ef'});
         $('.commentaries .item .head .username').css({'padding-left':'60px','display':'inline-block','padding-top':'0px'});
         $('.commentaries .item .body .reply').css({'margin':'0px','borderRadius':'3px'});
         $('.news_list .commentaries .item div.offtopic').css({'background-color':'#EDEDED','border':'1px solid #CDCDCD','color':'#ADADAD','padding':'2px'}).removeClass('offtopic');
         $('.commentaries .item .body noindex, .commentaries .item .body b, .commentaries .item .body i').css({'padding':'5px'});
         //$('.commentaries .item .body').each(function(){var txt = $(this).html();spacesForTags(txt);});
         //$('.comment_user_text').each(function(){var txt = $(this).html();spacesForTags(txt);});
         
         $('.news_list .commentaries .item div.spoiler').css('background', '#F9FBFB');
         
         /* spoiler div styles*/
         $('div.spoiler').css({'font-size':'12px'});
     });
     
     $('div#popuper_message_field').live('DOMNodeInserted', function(){
         $('.comment_user_text .clear').css({'border': 'none'});
         $('.comment_user_text div.offtopic').css({'font-size': '12px !important'});
         $('.comment_user_text div.offtopic .reply, .news_list .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'border': 'none !important'});
         $('.comment_user_text div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'color':'#444444'});
         $('.comment_user_text noindex, .comment_user_text b, .comment_user_text i').css({'padding':'5px'});
         //$('.commentaries .item .body').each(function(){var txt = $(this).html();spacesForTags(txt);});
         //$('.comment_user_text').each(function(){var txt = $(this).html();spacesForTags(txt);});
         $('.comment_user_text div.offtopic').css({'background-color':'#EDEDED','border':'1px solid #CDCDCD','color':'#ADADAD','padding':'2px'}).removeClass('offtopic');
     });

          const ourCommunityPic_1='http://www.gametech.ru/userpics/11097/upload/editor_buttons.png';
          $.ajax({
                      url:ourCommunityPic_1,
                      type:'HEAD',
                      success:
                          function(){
                              $('a.tb').css({'background-image':'url('+ourCommunityPic_1+')'});
                              $('div#comments_block_place').live('DOMNodeInserted', function(){
                                  $('a.tb').css({'background-image':'url('+ourCommunityPic_1+')'});
                              })
                          }
          });
     
     $('div.comment_content').live('DOMNodeInserted', function(ev){
        if($('.comment_update').length > 0){
             $('.comment_update .tb_href').attr('onclick',"window.ixbtstyleSJ(4, 'commentUpd');");
             $('.comment_update').parent('div').parent('div').find('#url_c').find('input[name="confirm"]').attr('onclick',"window.check_url_tagSJ('commentUpd');");
             $('.comment_update').parent('div').parent('div').find('#url_c').find('input[name="cancle"]').attr('onclick',"window.close_url_tagSJ('commentUpd');");
             $('.comment_update .button_send').css({'background-position':'0 -30px','color':'#FFFFFF', 'cursor':'pointer'});
             $('.comment_update .button_cancel').css({'cursor':'pointer'});
        }
    });
    
    window.lastCommentsShow();
 }
 else {
     $('div.g960').css({'background': '#F9FBFB','font-family':'Verdana','font-size':'12px'});
     $('div.left_col table.news_shortlist').load('http://www.gametech.ru/news/26889/ table.news_shortlist>tbody', function(res){
         window.lastCommentsShow();
     });
     $('div.more_news').remove();
     $('div.breadcrumbs').remove();
     $('div.news_block').css('margin','0 0 0 0');
 }
 
 if (window.location.pathname == '/news/') {
     window.lastCommentsShow(true);
 }

    /* функции для правильной работы вставки линки в редактировани комментария */
    window.ixbtstyleSJ = function (bbnumber, name){
        var txtarea = get_editfield(name);
        if(txtarea == null || !txtarea){
            return;
        }
        if(bbnumber == 4){
            var ctr_form = $('.comment_update').parent('div').parent('div').find('#url_c').get(0);
            
            // Если фрагмент текста был выделен, то добавляем его в виде названия ссылки
            var theSelection = '';

            if((clientVer >= 4) && is_ie && is_win){
                theSelection = document.selection.createRange().text;
            }

            else if(txtarea.selectionEnd){
                theSelection = mozExtractSelection(txtarea);
            }

            if(theSelection.indexOf('http://') == -1){
                $(ctr_form).find('#url_title').val(theSelection);
                $(ctr_form).find('#url_href').val('');
            }else{
                $(ctr_form).find('#url_title').val(theSelection);
                $(ctr_form).find('#url_href').val(theSelection);
            }

            if(!ctr_form){
                return;	
            }

            if(ctr_form.style.display == 'none'){

                var x  = GetLeftPos(txtarea);
                var y =  GetTopPos(txtarea);	

                ctr_form.style.left = x + 'px';
                ctr_form.style.top = y + 'px';
                ctr_form.style.display = 'block';
            }
        }
    };
    
    window.check_url_tagSJ = function(name){
        var ctr_form = $('.comment_update').parent('div').parent('div').find('#url_c');
        var href = ctr_form.find('#url_href').get(0);
        var title = ctr_form.find('#url_title').get(0);
        var result = '';

        if((!title.value && !href.value) || (title.value && !href.value)){
            result = '';
        }else{
            if(!title.value && href.value){
                title.value = href.value;
            }
            if(!href.value.match('http://')){
                href.value = 'http://' + href.value;
            }
            result = '[url href=' + href.value + ']' + title.value+ '[/url]';
        }

        var txtarea = get_editfield(name);
        if(txtarea == null || !txtarea){
            return;
        }


        if(result){
            var theSelection = '';
            var b_type = 0;
            // Определяем было ли сделано выделение и определяем тип браузера
            if((clientVer >= 4) && is_ie && is_win){
                theSelection = document.selection.createRange().text;
            }else if(txtarea.selectionEnd){
                theSelection = mozExtractSelection(txtarea);
                b_type = 1;
            }

            // Если выделения не было то добавляем в конец строки, иначе заменяем выделенный текст
            if(! theSelection){
                txtarea.value += result;
            }else{
                if(! b_type){
                    document.selection.createRange().text = result;
                }else{
                    mozWrapReplace(txtarea, result);
                }
            }
        }

        txtarea.focus();

        if(!ctr_form){
            return;
        }

        ctr_form.get(0).style.display = 'none';
    };
    
    window.close_url_tagSJ = function(name){
        var ctr_form = $('.comment_update').parent('div').parent('div').find('#url_c');
        ctr_form.find('#url_href').val('');
        ctr_form.find('#url_title').val('');

        if(!ctr_form){
            return;
        }

        ctr_form.get(0).style.display = 'none';
        var txtarea = get_editfield(name);

        if(txtarea){
            txtarea.focus();
        }
    };
}

addJQuery(main);