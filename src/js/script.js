$(document).ready(function () {
    // === comments ===

    let comments = {
        btnOpen: $('.comments .btn_4'),
        boxHide: $('.comments-box.hide')
    };

    comments.btnOpen.on('click', function(e) {
        e.preventDefault();
        $(this).addClass('hide');

        $(comments.boxHide[0]).removeClass('hide');
    })

    // === nav mobile ===

    let navMobile = {
        box: $('.nav'),
        btn: $('#btnNavMobile'),
        section: {
            btn: $('.nav-list__item_section'),
            list: $('.sections-list')
        }
    }

    navMobile.section.btn.on('click', function(e) {
        if($(window).width() <= 450) {
            e.preventDefault();
            let maxHeight = 10;
            let item = navMobile.section.list.find('.sections-list__item');
            for(let i = 0; i < item.length; i++) {
                maxHeight += parseInt($(item[i]).css('height'));
            }
            maxHeight += 'px'; 
            navMobile.section.list.toggleClass('active');
            if(navMobile.section.list.hasClass('active')) {
                navMobile.section.list.css('max-height', maxHeight);
            } else {
                navMobile.section.list.css('max-height', '0');
            }

        }
    })

    navMobile.btn.on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('open');
        navMobile.box.toggleClass('active');
        $('body').toggleClass('menu-open');
    });

    $(document).on("click", function (e) {
        if (navMobile.box.has(e.target).length === 0){
            navMobile.btn.removeClass('open');
            navMobile.box.removeClass('active');
        }
    });

    // === aside ===

    let aside = {
        left: {
            box: $('.aside-left'),
            btn: $('.btn-aside-left')
        },
        right: {
            box: $('.aside-right'),
            btn: $('.btn-aside-right')
        }
    }

    aside.right.btn.on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('open');
        aside.left.btn.removeClass('open').removeClass('load');

        aside.right.box.toggleClass('active');
        aside.left.box.removeClass('active').removeClass('load');
    });

    aside.left.btn.on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('open').removeClass('load');
        aside.right.btn.removeClass('open');

        aside.left.box.toggleClass('active').removeClass('load');
        aside.right.box.removeClass('active');
    });
    
    if(650 < $(window).width() < 1200) {
        aside.left.box.addClass('load active');
        aside.left.btn.addClass('load active');
    }
});