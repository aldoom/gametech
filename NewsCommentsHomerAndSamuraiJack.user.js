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
    /* store params/settings in coockies */
    /**
     * Example:
     * GET
     * gtnamespace.cookies.get('myCookie');
     *   returns value of myCookie if it is present, null if not 
     * gtnamespace.cookies.get(['myCookie', 'myOtherCookie']);
     *   returns array containing value of each requested cookie if it is present, null if not 
     * gtnamespace.cookies.get();
     *   returns array of all cookies from your site
     * 
     * 
     * FILTER
     * gtnamespace.cookies.filter( /^site/ );
     *   returns list of cookies whose names start with "site" 
     * 
     * 
     * SET
     * gtnamespace.cookies.set('myCookie', 'myValue');
     *   sets cookie by the name of 'myCookie' to value of 'myValue' with default options 
     * gtnamespace.cookies.set('myCookie', 'myValue', {path: '/somedir'});
     *   sets cookie by the name of 'myCookie' to value of 'myValue' with path of '/somedir' 
     * 
     * 
     * DELETE
     * gtnamespace.cookies.del('myCookie');
     *   deletes a cookie, 'myCookie', with default options 
     * gtnamespace.cookies.del('myCookie', {path: '/somedir'});
     *   deletes a cookie by the name of 'myCookie' which had been set with a path of '/somedir' 
     * gtnamespace.cookies.del(true);
     *   deletes all cookies 
     * 
     * 
     * TEST
     * gtnamespace.cookies.test();
     *   attempts to set a cookie and returns true or false upon success or failure 
     * 
     * 
     * SET OPTIONS
     * gtnamespace.cookies.setOptions({path: '/somedir'});
     *   all cookies will be set or deleted with the path , '/somedir', unless it is explicitly provided in a passed options object 
     * 
     * 
     * 
     */
    var gtnamespace = window.gtnamespace || {};
    gtnamespace.cookies = ( function() {
        var resolveOptions, assembleOptionsString, parseCookies, constructor, defaultOptions = {
            expiresAt: null,
            path: '/',
            domain:  null,
            secure: false
        };
        
        /**
        * resolveOptions - receive an options object and ensure all options are present and valid, replacing with defaults where necessary
        *
        * @access private
        * @static
        * @parameter Object options - optional options to start with
        * @return Object complete and valid options object
        */
        resolveOptions = function( options )
        {
            var returnValue, expireDate;

            if( typeof options !== 'object' || options === null )
            {
                returnValue = defaultOptions;
            }
            else
            {
                returnValue = {
                    expiresAt: defaultOptions.expiresAt,
                    path: defaultOptions.path,
                    domain: defaultOptions.domain,
                    secure: defaultOptions.secure
                };

                if( typeof options.expiresAt === 'object' && options.expiresAt instanceof Date )
                {
                    returnValue.expiresAt = options.expiresAt;
                }
                else
                {
                    expireDate = new Date();
                    expireDate.setTime( expireDate.getTime() + ( 365 * 24 * 60 * 60 * 1000 ) );
                    returnValue.expiresAt = expireDate;
                }

                if( typeof options.path === 'string' && options.path !== '' )
                {
                    returnValue.path = options.path;
                }

                if( typeof options.domain === 'string' && options.domain !== '' )
                {
                    returnValue.domain = options.domain;
                }

                if( options.secure === true )
                {
                    returnValue.secure = options.secure;
                }
            }

            return returnValue;
        };
        
        /**
        * assembleOptionsString - analyze options and assemble appropriate string for setting a cookie with those options
        *
        * @access private
        * @static
        * @parameter options OBJECT - optional options to start with
        * @return STRING - complete and valid cookie setting options
        */
        assembleOptionsString = function( options )
        {
            options = resolveOptions( options );

            return (
                ( typeof options.expiresAt === 'object' && options.expiresAt instanceof Date ? '; expires=' + options.expiresAt.toGMTString() : '' ) +
                '; path=' + options.path +
                ( typeof options.domain === 'string' ? '; domain=' + options.domain : '' ) +
                ( options.secure === true ? '; secure' : '' )
            );
        };
        
        /**
        * parseCookies - retrieve document.cookie string and break it into a hash with values decoded and unserialized
        *
        * @access private
        * @static
        * @return OBJECT - hash of cookies from document.cookie
        */
        parseCookies = function()
        {
            var cookies = {}, i, pair, name, value, separated = document.cookie.split( ';' ), unparsedValue;
            for( i = 0; i < separated.length; i = i + 1 )
            {
                pair = separated[i].split( '=' );
                name = pair[0].replace( /^\s*/, '' ).replace( /\s*$/, '' );

                try
                {
                    value = decodeURIComponent( pair[1] );
                }
                catch( e1 )
                {
                    value = pair[1];
                }

                if( typeof JSON === 'object' && JSON !== null && typeof JSON.parse === 'function' )
                {
                    try
                    {
                        unparsedValue = value;
                        value = JSON.parse( value );
                    }
                    catch( e2 )
                    {
                        value = unparsedValue;
                    }
                }

                cookies[name] = value;
            }
            return cookies;
        };

        constructor = function(){};

        /**
         * get - get one, several, or all cookies
         *
         * @access public
         * @paramater Mixed cookieName - String:name of single cookie; Array:list of multiple cookie names; Void (no param):if you want all cookies
         * @return Mixed - Value of cookie as set; Null:if only one cookie is requested and is not found; Object:hash of multiple or all cookies (if multiple or all requested);
         */
        constructor.prototype.get = function( cookieName )
        {
            var returnValue, item, cookies = parseCookies();

            if( typeof cookieName === 'string' )
            {
                returnValue = ( typeof cookies[cookieName] !== 'undefined' ) ? cookies[cookieName] : null;
            }
            else if( typeof cookieName === 'object' && cookieName !== null )
            {
                returnValue = {};
                for( item in cookieName )
                {
                    if( typeof cookies[cookieName[item]] !== 'undefined' )
                    {
                        returnValue[cookieName[item]] = cookies[cookieName[item]];
                    }
                    else
                    {
                        returnValue[cookieName[item]] = null;
                    }
                }
            }
            else
            {
                returnValue = cookies;
            }

            return returnValue;
        };
        
        /**
         * filter - get array of cookies whose names match the provided RegExp
         *
         * @access public
         * @paramater Object RegExp - The regular expression to match against cookie names
         * @return Mixed - Object:hash of cookies whose names match the RegExp
         */
        constructor.prototype.filter = function( cookieNameRegExp )
        {
            var cookieName, returnValue = {}, cookies = parseCookies();

            if( typeof cookieNameRegExp === 'string' )
            {
                cookieNameRegExp = new RegExp( cookieNameRegExp );
            }

            for( cookieName in cookies )
            {
                if( cookieName.match( cookieNameRegExp ) )
                {
                    returnValue[cookieName] = cookies[cookieName];
                }
            }

            return returnValue;
        };
        
        /**
         * set - set or delete a cookie with desired options
         *
         * @access public
         * @paramater String cookieName - name of cookie to set
         * @paramater Mixed value - Any JS value. If not a string, will be JSON encoded; NULL to delete
         * @paramater Object options - optional list of cookie options to specify
         * @return void
         */
        constructor.prototype.set = function( cookieName, value, options )
        {
            if( typeof options !== 'object' || options === null )
            {
                options = {};
            }

            if( typeof value === 'undefined' || value === null )
            {
                value = '';
                options.expiresAt = -8760;
            }

            else if( typeof value !== 'string' )
            {
                if( typeof JSON === 'object' && JSON !== null && typeof JSON.stringify === 'function' )
                {
                    value = JSON.stringify( value );
                }
                else
                {
                    throw new Error( 'cookies.set() received non-string value and could not serialize.' );
                }
            }


            var optionsString = assembleOptionsString( options );

            document.cookie = cookieName + '=' + encodeURIComponent( value ) + optionsString;
        };
        
        /**
         * del - delete a cookie (domain and path options must match those with which the cookie was set; this is really an alias for set() with parameters simplified for this use)
         *
         * @access public
         * @paramater MIxed cookieName - String name of cookie to delete, or Bool true to delete all
         * @paramater Object options - optional list of cookie options to specify ( path, domain )
         * @return void
         */
        constructor.prototype.del = function( cookieName, options )
        {
            var allCookies = {}, name;

            if( typeof options !== 'object' || options === null )
            {
                options = {};
            }

            if( typeof cookieName === 'boolean' && cookieName === true )
            {
                allCookies = this.get();
            }
            else if( typeof cookieName === 'string' )
            {
                allCookies[cookieName] = true;
            }

            for( name in allCookies )
            {
                if( typeof name === 'string' && name !== '' )
                {
                    this.set( name, null, options );
                }
            }
        };
        
        /**
         * test - test whether the browser is accepting cookies
         *
         * @access public
         * @return Boolean
         */
        constructor.prototype.test = function()
        {
            var returnValue = false, testName = 'cT', testValue = 'data';

            this.set( testName, testValue );

            if( this.get( testName ) === testValue )
            {
                this.del( testName );
                returnValue = true;
            }

            return returnValue;
        };
        
        /**
         * setOptions - set default options for calls to cookie methods
         *
         * @access public
         * @param Object options - list of cookie options to specify
         * @return void
         */
        constructor.prototype.setOptions = function( options )
        {
            if( typeof options !== 'object' )
            {
                options = null;
            }

            defaultOptions = resolveOptions( options );
        };

        return new constructor();
    } )();
    
    gtnamespace.theme = ( function() {
        var constructor, defaultTheme = {
            name: 'Theme Default',
            fontFamily: 'Verdana',
            commentBodyGradient: true,
            commentBodyColorStart: '#FFFFFF',
            commentBodyColorEnd: '#BACDDD'
        },
        SJTheme = {
            name: 'Theme SamuraiJack',
            fontFamily: 'Arial,Helvetica,sans-serif',
            commentBodyGradient: false,
            commentBodyColorStart: '#FFFFFF',
            commentBodyColorEnd: '#EAF2F9'
        },
        cookieCurrentTheme = 'gt-current-theme';
        
        constructor = function(){};
        
        constructor.prototype.getCurrentTheme = function() {
            var currentTheme = gtnamespace.cookies.get(cookieCurrentTheme);
            if (currentTheme == null) {
                return defaultTheme;
            } else {
                return currentTheme;
            }
            
        };
        
        constructor.prototype.init = function() {
/*
<div class="user_theme_block">
	<div class="user_theme_current">Theme Default</div>
	<div class="clear"></div>
    <div class="user_theme_settings">
        <select>
            <option value="0">Theme Default</option>
            <option value="1">My Theme</option>
        </select>
    </div>
    <div class="clear"></div>
</div>
*/
            var currentTheme = this.getCurrentTheme();
            var userThemeBlock = $('<div class="user_theme_block"></div>');
            var startPositionForThemeBlock=$('div.user_logined_block')[0] || $('div.auth_actions')[0];
            userThemeBlock.insertAfter(startPositionForThemeBlock);
            
            var headerThemeBlock = $('<div class="user_theme_current"></div>');
        };
        
    } )();
    
    gtnamespace.cookies.set('property',obj1);
    gtnamespace.cookies.set('theme-currnet','myTheme');
    
    console.log(gtnamespace.cookies.get());
    
    /* our styles */
    var styles = $('<style type="text/css" />').appendTo('head');
    styles.html('.user_theme_block {background: -moz-linear-gradient(center top , #F0DE39 0%, #F0DE39 2%, #F9D857 50%, #F9D650 51%, #F9D650 100%) repeat scroll 0 0 transparent;border-radius: 10px 10px 10px 10px;box-shadow: 0 0 3px 1px #F9E350 inset;margin: 0 0 1.5em;padding: 10px;position: relative;}');
    
    var currentTheme = gtnamespace.theme.getCurrentTheme();
  
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

  var OurCommunityComment=function(){
    var backgroundCommentBodyGradient={
        'backgroundMoz': '-moz-linear-gradient(left,  #ffffff 0%, #ffffff 46%, #bacddd 100%)',
        'backgroundWK1': '-webkit-gradient(linear, left top, right top, color-stop(0%,#ffffff), color-stop(46%,#ffffff), color-stop(100%,#bacddd))',
        'backgroundWK2': '-webkit-linear-gradient(left,  #ffffff 0%,#ffffff 46%,#bacddd 100%)',
        'backgroundO': '-o-linear-gradient(left,  #ffffff 0%,#ffffff 46%,#bacddd 100%)',
        'backgroundW3c': 'linear-gradient(left,  #ffffff 0%,#ffffff 46%,#bacddd 100%)'
    };
    for (var ourBackground in backgroundCommentBodyGradient){
        $('.commentaries .item .body').css('background',backgroundCommentBodyGradient[ourBackground]);
    }
    $('.commentaries .item .body').css('border-radius','3px');
    $('.commentaries .item .head').css({'height': '20px','background':'#eaf2f9','margin': '25px 0 25px 0'});
    $('.commentaries .item .head .userpic').css({'background':'#eaf2f9','width':'50px','height':'50px', 'top': '-20px', 'padding':'3px','borderRadius':'3px','border':'1px solid #dbe7ef'});
  }
    OurCommunityComment();


    $('.news_list .item').css('font-size', '14px');
    $('.news_list .item h3').css({'font-size':'17px','font-weight':'bold'});
    $('div.g960').css({'background': '#F9FBFB','font-family':currentTheme.fontFamily});
    $('.news_list .commentaries .item div.spoiler').css('background', '#F9FBFB');
     $('.news_list .item .clear').css({'border': 'none'});
     $('.news_list .item div.offtopic').css({'font-size': '12px !important'});
     $('.news_list .item div.offtopic .reply, .news_list .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'border': 'none !important'});
     $('.news_list .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'color':'#444444'});
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
         OurCommunityComment();
         $('.news_list .commentaries .item').css('font-size', '14px');
         $('.news_list .commentaries .item .clear').css({'border': 'none'});
         $('.news_list .commentaries .item div.offtopic').css({'font-size': '12px !important'});
         $('.news_list .commentaries .item div.offtopic .reply, .news_list .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'border': 'none !important'});
         $('.news_list .commentaries .item div.offtopic .reply b, .news_list .item div.offtopic .reply a').css({'color':'#444444'});
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
     $('div.g960').css({'background': '#F9FBFB','font-family':currentTheme.fontFamily,'font-size':'12px'});
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
