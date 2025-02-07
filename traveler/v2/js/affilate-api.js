
/*TP Flight*/
jQuery(document).ready(function($) {
    $(document).on('click','.option-wrapper.st-option-wrapper .option1',function(e) {
        $('.st-affilate .tab-content .active .check-in-wrapper').click();
    });

    $(document).on('DOMSubtreeModified','.st-affilate .tab-content .active .check-in-render',function(e) {
        $('.st-affilate .tab-content .active .field-guest').addClass('open');
        $('.st-affilate .tab-content .active .field-guest .dropdown').attr('aria-expanded',true);
        $('.st-affilate .tab-content .active .field-guest .dropdown-menu').show();
    });

    "use strict";
    var last_select_clicked = !1;
    $('.tp-flight-location').each(function() {
        var t = $(this);
        var parent = t.closest('.tp-flight-wrapper');
        $(this).keyup(function(event) {
            last_select_clicked = t;
            parent.find('.st-location-id').remove();
            var name = t.attr('data-name');
            var locale = t.attr('data-locale');
            var val = t.val();
            if (val.length >= 2) {
                $.getJSON("https://autocomplete.travelpayouts.com/jravia?locale=" + locale + "&with_countries=false&q=" + val, function(data) {
                    if (typeof data == 'object') {
                        var html = '';
                        html += '<select name="' + name + '" class="st-location-id st-hidden" tabindex="-1">';
                        $.each(data, function(key, value) {
                            var f_name = '';
                            if (value.name != null) {
                                f_name = '(' + value.name + ')'
                            }
                            html += '<option value="' + value.code + '">' + value.city_fullname + ' ' + f_name + ' - ' + value.code + '</option>'
                        });
                        html += '</select>';
                        parent.find('.st-location-id').remove();
                        parent.append(html);
                        html = '';
                        $('select option', parent).prop('selected', !1);
                        $('select option', parent).each(function(index, el) {
                            var country = $(this).data('country');
                            var text = $(this).text();
                            var text_split = text.split("||");
                            text_split = text_split[0];
                            var highlight = get_highlight(text, val);
                            if (highlight.indexOf('</span>') >= 0) {
                                var current_country = $(this).parent('select').attr('data-current-country');
                                if (typeof current_country != 'undefined' && current_country != '') {
                                    if (country == current_country) {
                                        html += '<div data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option">' + '<span class="label"><a href="#">' + text_split + ' <i class="fa fa-plane"></i></a>' + '</div>'
                                    }
                                } else {
                                    html += '<div data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option">' + '<span class="label"><a href="#">' + text_split + ' <i class="fa fa-plane"></i></a>' + '</div>'
                                }
                            }
                        });
                        $('.option-wrapper').html(html).show();
                        t.caculatePosition($('.option-wrapper'), t)
                    }
                })
            }
        });
        t.caculatePosition = function() {
            if (!last_select_clicked || !last_select_clicked.length) return;
            var wraper = $('.option-wrapper');
            var input_tag = last_select_clicked;
            var offset = parent.offset();
            var top = offset.top + parent.height();
            var left = offset.left;
            var width = input_tag.outerWidth();
            var wpadminbar = 0;
            if ($('#wpadminbar').length && $(window).width() >= 783) {
                wpadminbar = $('#wpadminbar').height()
            } else {
                wpadminbar = 0
            }
            top = top - wpadminbar;
            var z_index = 99999;
            var position = 'absolute';
            if ($('#search-dialog').length) {
                position = 'fixed';
                top = top + wpadminbar - $(window).scrollTop();
                z_index = 99999
            }
            wraper.css({
                position: position,
                top: top,
                left: left,
                width: width,
                'z-index': z_index
            })
        };
        $(window).resize(function() {
            t.caculatePosition()
        })
    });

    function get_highlight(text, val) {
        var highlight = text.replace(new RegExp(val + '(?!([^<]+)?>)', 'gi'), '<span class="highlight">$&</span>');
        return highlight
    }

    var flight_to = '';
    $('.input-daterange .tp_depart_date').each(function() {
        var form = $(this).closest('form');
        var p = $(this).parent();
        var me = $(this);
        $(this).datepicker({
            language: st_params.locale,
            format: 'dd/mm/yyyy',
            autoclose: !0,
            todayHighlight: !0,
            startDate: 'today',
            format: p.data('tp-date-format'),
            weekStart: 1,
        }).on('changeDate', function(e) {
            var m = e.date.getMonth() + 1;
            if ((e.date.getMonth() + 1) < 10) {
                m = '0' + m
            }
            var d = e.date.getDate();
            if (e.date.getDate() < 10) {
                d = '0' + d
            }
            $(this).parent().find('.tp-date-from').val(e.date.getFullYear() + '-' + (m) + '-' + d);
            var new_date = e.date;
            new_date.setDate(new_date.getDate() + 1);
            $('.input-daterange .tp_return_date', form).datepicker("remove");
            $('.input-daterange .tp_return_date', form).datepicker({
                language: st_params.locale,
                format: 'dd/mm/yyyy',
                startDate: '+1d',
                format: p.data('tp-date-format'),
                autoclose: !0,
                todayHighlight: !0,
                weekStart: 1
            });
            $('.input-daterange .tp_return_date', form).datepicker('setDates', new_date);
            $('.input-daterange .tp_return_date', form).datepicker('setStartDate', new_date);
            update_link()
        });
        $('.input-daterange .tp_return_date', form).datepicker({
            language: st_params.locale,
            format: 'dd/mm/yyyy',
            startDate: '+1d',
            format: p.data('tp-date-format'),
            autoclose: !0,
            todayHighlight: !0,
            weekStart: 1
        }).on('changeDate', function(e) {
            var m = e.date.getMonth() + 1;
            if ((e.date.getMonth() + 1) < 10) {
                m = '0' + m
            }
            var d = e.date.getDate();
            if (e.date.getDate() < 10) {
                d = '0' + d
            }
            flight_to = e.date.getFullYear() + '-' + (m) + '-' + d;
            $(this).parent().find('.tp-date-to').val(flight_to);
            var del_html = '<i class="fa fa-times tp-icon-return-del"></i>';
            $('.input-daterange-return').append(del_html);
            if($('.tp_group_display').length){
                console.log(123);
                $('.tp_group_display').trigger('click');
            }
            update_link()
        })
    });
    $(document).on('click', '.tp-icon-return-del', function() {
        $('.input-daterange .tp_return_date').val('');
        $('input.tp-date-to').val('');
        $(this).remove();
        update_link()
    });
    $('.form-passengers-class .tp_group_display').click(function() {
        $(this).parent().find('.tp-form-passengers-class').toggleClass('none');
        $(this).find('.fa').toggleClass('fa-chevron-up');
        $(this).find('.fa').toggleClass('fa-chevron-down')
    });
    $('.tp-checkbox-class .checkbox-class').on('ifChecked', function(event) {
        $('.tp-checkbox-class input[name=trip_class]').val('1');
        var text = $('.form-passengers-class .display-class').data('business');
        $('.form-passengers-class .display-class').text(text)
    });
    $('.tp-checkbox-class .checkbox-class').on('ifUnchecked', function(event) {
        $('.tp-checkbox-class input[name=trip_class]').val('0');
        var text = $('.form-passengers-class .display-class').data('economy');
        $('.form-passengers-class .display-class').text(text)
    });
    $(document).on('keyup mouseup', '.passengers-class input[name=adults]', function() {
        if ($(this).val() == '') {
            //$(this).val(1)
        } else {
            var infants = $('.twidget-age-group input[name=infants]').val();
            if (infants == '')
                infants = 0;
            var children = $('.twidget-age-group input[name=children]').val();
            if (children == '')
                children = 0;
            var total = parseInt(infants) + parseInt(children) + parseInt($(this).val());
            if (total > 9) {
                var adults = 9 - (parseInt(infants) + parseInt(children));
                $(this).val(adults);
                $('.tp-form-passengers-class .notice').fadeIn()
            } else {
                $('.tp_group_display .quantity-passengers').text(total);
                $('.tp-form-passengers-class .notice').fadeOut()
            }
        }
    });
    $(document).on('keyup mouseup', '.passengers-class input[name=children]', function() {
        if ($(this).val() == '') {
            //$(this).val(0)
        } else {
            var infants = $('.twidget-age-group input[name=infants]').val();
            if (infants == '')
                infants = 0;
            var adults = $('.twidget-age-group input[name=adults]').val();
            if (adults == '')
                adults = 0;
            var total = parseInt(infants) + parseInt(adults) + parseInt($(this).val());
            if (total > 9) {
                var children = 9 - (parseInt(infants) + parseInt(adults));
                $(this).val(children);
                $('.tp-form-passengers-class .notice').fadeIn()
            } else {
                $('.tp_group_display .quantity-passengers').text(total);
                $('.tp-form-passengers-class .notice').fadeOut()
            }
        }
    });
    $(document).on('keyup mouseup', '.passengers-class input[name=infants]', function() {
        if ($(this).val() == '') {
            //$(this).val(0)
        } else {
            var adults = $('.twidget-age-group input[name=adults]').val();
            if (adults == '')
                adults = 0;
            var children = $('.twidget-age-group input[name=children]').val();
            if (children == '')
                children = 0;
            var total = parseInt(adults) + parseInt(children) + parseInt($(this).val());
            if (total > 9) {
                var infants = 9 - (parseInt(children) + parseInt(adults));
                $(this).val(infants);
                $('.tp-form-passengers-class .notice').fadeIn()
            } else {
                $('.tp_group_display .quantity-passengers').text(total);
                $('.tp-form-passengers-class .notice').fadeOut()
            }
        }
    });
    $(document).on('focusout', '.passengers-class input[name=adults]', function() {
        if ($(this).val() == '' || $(this).val() == 0) {
            $(this).val(1)
        }
    });
    $(document).on('focusout', '.passengers-class input[name=children], .passengers-class input[name=infants]', function() {
        if ($(this).val() == '') {
            $(this).val(0)
        }
    });
    var last_select_clicked = !1;
    $('.tp-hotel-destination').each(function() {
        var t = $(this);
        var parent = t.closest('.tp-hotel-wrapper');
        $(this).keyup(function(event) {
            last_select_clicked = t;
            parent.find('.st-location-id').remove();
            var name = t.attr('data-name');
            var locale = t.attr('data-locale');
            var val = t.val();
            if (val.length >= 2) {
                $.getJSON("https://engine.hotellook.com/api/v2/lookup.json?query=" + val + "&lang=" + locale + "&limit=5", function(data) {
                    if (typeof data == 'object') {
                        var html = '';
                        html += '<select name="' + name + '" class="st-location-id st-hidden" tabindex="-1">';
                        $.each(data.results.locations, function(key, value) {
                            html += '<option data-type="location" value="' + value.id + '">' + value.fullName + ' - ' + value.hotelsCount + ' ' + t.attr('data-text') + '</option>'
                        });
                        $.each(data.results.hotels, function(key, value) {
                            html += '<option data-type="hotel" value="' + value.id + '">' + value.fullName + '</option>'
                        });
                        html += '</select>';
                        parent.find('.st-location-id').remove();
                        parent.append(html);
                        html = '';
                        $('select option', parent).prop('selected', !1);
                        $('select option', parent).each(function(index, el) {
                            var country = $(this).data('country');
                            var text = $(this).text();
                            var text_split = text.split("||");
                            text_split = text_split[0];
                            var highlight = get_highlight(text, val);
                            if (highlight.indexOf('</span>') >= 0) {
                                if ($(this).data('type') == 'location') {
                                    html += '<div data-text="' + text + '" data-value="' + $(this).val() + '" class="option1">' + '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' + '</div>'
                                } else {
                                    html += '<div data-text="' + text + '" data-value="' + $(this).val() + '" class="option1">' + '<span class="label"><a href="#">' + text_split + '<i class="fa fa-building"></i></a>' + '</div>'
                                }
                            }
                        });
                        $('.option-wrapper').html(html).show();
                        t.caculatePosition($('.option-wrapper'), t)
                    }
                })
            }
        });
        $(document).on('click', '.option-wrapper .option1', function(event) {
            if (last_select_clicked.length > 0) {
                var parent = last_select_clicked.closest('.st-select-wrapper');
                event.preventDefault();
                var value = $(this).data('value');
                var text = $(this).text();
                if (text != "") {
                    last_select_clicked.val(text);
                    $('select option[value="' + value + '"]', parent).prop('selected', !0);
                    $('.option-wrapper').html('').hide()
                }
            }
        });
        t.caculatePosition = function() {
            if (!last_select_clicked || !last_select_clicked.length) return;
            var wraper = $('.option-wrapper');
            var input_tag = last_select_clicked;
            var offset = parent.offset();
            var top = offset.top + parent.height();
            var left = offset.left;
            var width = input_tag.outerWidth();
            var wpadminbar = 0;
            if ($('#wpadminbar').length && $(window).width() >= 783) {
                wpadminbar = $('#wpadminbar').height()
            } else {
                wpadminbar = 0
            }
            top = top - wpadminbar;
            var z_index = 99999;
            var position = 'absolute';
            if ($('#search-dialog').length) {
                position = 'fixed';
                top = top + wpadminbar - $(window).scrollTop();
                z_index = 99999
            }
            wraper.css({
                position: position,
                top: top,
                left: left,
                width: width,
                'z-index': z_index
            })
        };
        $(window).resize(function() {
            t.caculatePosition()
        })
    });
    $(document).on('keyup mouseup', '.guests input[name=adults]', function() {
        if ($(this).val() == '') {} else {
            var children = $('.guests .children').val();
            if (parseInt($(this).val()) > 4) {
                $(this).val(4);
                $(this).closest('.tp-form-passengers-class').find('.notice').fadeIn()
            } else {
                var num_ad = parseInt($(this).val());
                if (typeof num_ad != 'number') {
                    num_ad = 1
                }
                var total = parseInt(children) + num_ad;
                $('.tp_guests_field .quantity-guests').text(total);
                $(this).closest('.tp-form-passengers-class').find('.notice').fadeOut()
            }
        }
    });
    var gl_index = 0;
    $(document).on('keyup mouseup', '.guests input.children', function() {
        if ($(this).val() == '') {
            gl_index = 0;
            $('.tp-children-group').empty()
        } else {
            var adults = $('.guests input[name=adults]').val();
            if (parseInt($(this).val()) > 3) {
                $(this).val(0);
                $(this).closest('.tp-form-passengers-class').find('.notice').fadeIn();
                gl_index = 0;
                $('.tp-children-group').empty();
                var total = parseInt(adults);
                $('.tp_guests_field .quantity-guests').text(total)
            } else {
                var total = parseInt(adults) + parseInt($(this).val());
                $('.tp_guests_field .quantity-guests').text(total);
                $(this).closest('.tp-form-passengers-class').find('.notice').fadeOut();
                if (gl_index > parseInt($(this).val())) {
                    for (var i = gl_index; i > parseInt($(this).val()); i--) {
                        $('.tp-children-group').find('.children-input-' + (i - 1)).remove()
                    }
                }
                if (gl_index < parseInt($(this).val())) {
                    for (var i = gl_index; i < parseInt($(this).val()); i++) {
                        var html = '<div class="children-input-' + i + '"><label>' + $(this).data('text') + ' ' + (i + 1) + ')</label><span><input type="number" class="" name="children[' + i + ']" value="7" max="17" min="0"></span></div>';
                        $('.tp-children-group').append(html)
                    }
                }
                gl_index = parseInt($(this).val())
            }
        }
    });
    var last_select_clicked = !1;
    $('.ss-flight-location').each(function() {
        var t = $(this);
        var parent = t.closest('.ss-flight-wrapper');
        $(this).keyup(function(event) {
            last_select_clicked = t;
            parent.find('.st-location-id').remove();
            var locale = $('.skyscanner-search-flights-data').data('locale');
            var name = t.attr('data-name');
            var val = t.val();
            if (val.length >= 2) {
                var l = locale.split('-');
                var url = "https://autocomplete.travelpayouts.com/jravia?locale=" + l[0] + "&with_countries=false&q=" + val;
                $.getJSON(url, function(data) {
                    if (typeof data == 'object') {
                        if (typeof data == 'object') {
                            var html = '';
                            html += '<select class="st-location-id st-hidden" tabindex="-1">';
                            $.each(data, function(key, value) {
                                var n = value.name;
                                if (value.name == null) {
                                    n = value.title
                                }
                                html += '<option value="' + value.code + '">' + value.city_fullname + ' (' + n + ') - ' + value.code + '</option>'
                            });
                            html += '</select>';
                            parent.find('.st-location-id').remove();
                            parent.append(html);
                            html = '';
                            $('select option', parent).prop('selected', !1);
                            $('select option', parent).each(function(index, el) {
                                var country = $(this).data('country');
                                var text = $(this).text();
                                var text_split = text.split("||");
                                text_split = text_split[0];
                                var highlight = get_highlight(text, val);
                                if (highlight.indexOf('</span>') >= 0) {
                                    html += '<div data-text="' + text + '" data-value="' + $(this).val() + '" class="option2">' + '<span class="label"><a href="#">' + text_split + '</a>' + '</div>'
                                }
                            });
                            $('.option-wrapper').html(html).show();
                            t.caculatePosition($('.option-wrapper'), t)
                        }
                    }
                })
            }
        });
        $(document).on('click', '.option-wrapper .option2', function(event) {
            if (last_select_clicked.length > 0) {
                var parent = last_select_clicked.closest('.st-select-wrapper');
                event.preventDefault();
                var value = $(this).data('value');
                var text = $(this).text();
                if (text != "") {
                    last_select_clicked.val(text);
                    last_select_clicked.attr('data-value', $(this).data('value'));
                    $('select option[value="' + value + '"]', parent).prop('selected', !0);
                    $('.option-wrapper').html('').hide();
                    update_link();
                    if(last_select_clicked.data('index') == '1'){
                        var nextElField = $('#ss_location_destination');
                        if(nextElField.val() === ''){
                            nextElField.focus();
                        }else{
                            $('.tp_depart_date').focus();
                        }
                    }else{
                        $('.tp_depart_date').focus();
                    }
                }
            }
        });
        t.caculatePosition = function() {
            if (!last_select_clicked || !last_select_clicked.length) return;
            var wraper = $('.option-wrapper');
            var input_tag = last_select_clicked;
            var offset = parent.offset();
            var top = offset.top + parent.height();
            var left = offset.left;
            var width = input_tag.outerWidth();
            var wpadminbar = 0;
            if ($('#wpadminbar').length && $(window).width() >= 783) {
                wpadminbar = $('#wpadminbar').height()
            } else {
                wpadminbar = 0
            }
            top = top - wpadminbar;
            var z_index = 99999;
            var position = 'absolute';
            if ($('#search-dialog').length) {
                position = 'fixed';
                top = top + wpadminbar - $(window).scrollTop();
                z_index = 99999
            }
            wraper.css({
                position: position,
                top: top,
                left: left,
                width: width,
                'z-index': z_index
            })
        };
        $(window).resize(function() {
            t.caculatePosition()
        })
    });

    function update_link() {
        var locale = $('.skyscanner-search-flights-data').data('locale');
        var market = $('.skyscanner-search-flights-data').data('country');
        var currency = $('.skyscanner-search-flights-data').data('currency');
        var old = 'http://partners.api.skyscanner.net/apiservices/referral/v1.0/' + market + '/' + currency + '/' + locale + '/';
        var or = $('#ss_location_origin').attr('data-value');
        var de = $('#ss_location_destination').attr('data-value');
        var dp = $('.tp-date-from.ss_depart').attr('value');
        var rt = '';
        if ($('.tp-date-to.ss_return').attr('value') != null) {
            rt = '/' + $('.tp-date-to.ss_return').attr('value')
        }
        var key = $('.skyscanner-search-flights-data').data('api');
        var new_url = old + or + '/' + de + '/' + dp + rt;
        $('.ss-search-flights-link').attr('action', new_url)
    }

    jQuery(function($) {
        $(document).ready(function() {
            $(document).on('click', '.btn-tp-search-flights', function(e) {
                e.preventDefault();
                var form = $(this).closest('form');
                var required = !1;
                $('input', form).each(function() {
                    if ($(this).prop('required')) {
                        if ($(this).val() == '') {
                            required = !0;
                            $(this).addClass('error')
                        } else {
                            $(this).removeClass('error')
                        }
                    }
                });
                var marker = form.find('input[name="marker"]').val();
                var origin_iata = form.find('select[name="origin_iata"] option:selected').val();
                var destination_iata = form.find('select[name="destination_iata"] option:selected').val();
                var depart_date = form.find('input[name="depart_date"]').val();
                var return_date = form.find('input[name="return_date"]').val();
                var adults = form.find('input[name="adults"]').val();
                var children = form.find('input[name="children"]').val();
                var infants = form.find('input[name="infants"]').val();
                var trip_class = form.find('input[name="trip_class"]').val();
                var with_request = form.find('input[name="with_request"]').val();
                var param = 'marker=' + marker + '&origin_iata=' + origin_iata + '&destination_iata=' + destination_iata + '&depart_date=' + depart_date + '&return_date=' + return_date + '&adults=' + adults + '&children=' + children + '&infants=' + infants + '&trip_class=' + trip_class + '&with_request=' + with_request;
                var current_url = $('#current_url').val();
                console.log(current_url + '?' + param);
                if (!required) {
                    window.location.href = current_url + '?' + param
                }
            });
            $(document).on('click', '.btn-tp-search-hotels', function(e) {
                e.preventDefault();
                var form = $(this).closest('form');
                var required = !1;
                if ($('#location_destination_h').val() == '') {
                    required = !0;
                    $('#location_destination_h').addClass('error')
                } else {
                    required = !1;
                    $('#location_destination_h').removeClass('error')
                }
                var marker = form.find('input[name="marker"]').val();
                var destination = form.find('select[name="destination"] option:selected').val();
                var checkIn = form.find('input[name="checkIn"]').val();
                var checkOut = form.find('input[name="checkOut"]').val();
                var adults = form.find('input[name="adults"]').val();
                if ($('input[name="children[0]"]').length > 0) {
                    var children = form.find('input[name="children[0]"]').val()
                }
                if ($('input[name="children[1]"]').length > 0) {
                    var children1 = form.find('input[name="children[1]"]').val()
                }
                if ($('input[name="children[2]"]').length > 0) {
                    var children2 = form.find('input[name="children[2]"]').val()
                }
                var param = 'marker=' + marker + '&destination=' + destination + '&checkIn=' + checkIn + '&checkOut=' + checkOut + '&adults=' + adults;
                if (children != undefined) {
                    param += '&children%5B0%5D=' + children
                }
                if (children1 != undefined) {
                    param += '&children%5B1%5D=' + children
                }
                if (children2 != undefined) {
                    param += '&children%5B2%5D=' + children
                }
                var current_url = $('#current_url_hotel').val();
                if (!required) {
                    window.location.href = current_url + '/hotels/?' + param
                }
            })
        })
    })
});


jQuery(document).ready(function($) {
    var last_select_clicked = false;
    $('body').append('<div class="option-wrapper st-option-wrapper"></div>');
    var t_temp;
    $('.st-location-name').each(function(index, el) {
        var form = $(this).parents('form');
        var parent = $(this).parents('.st-select-wrapper');
        var t = $(this);
        var flag = true;
        $('.option-wrapper', parent).remove();
        t.keyup(function(event) {
            t_temp = t;
            last_select_clicked = t;
            if (event.which != 40 && event.which != 38 && event.which != 9) {
                val = $(this).val();
                if (event.which != 13) {

                    flag = false;
                    if (val != '') {
                        html = '';
                        $('select option', parent).prop('selected', false);
                        $('select option', parent).each(function(index, el) {
                            var country = $(this).data('country');
                            var text = $(this).text();
                            var text_split = text.split("||");
                            text_split = text_split[0];
                            var highlight = get_highlight(text, val);
                            if (highlight.indexOf('</span>') > 0) {
                                var current_country = $(this).parent('select').attr('data-current-country');
                                if (typeof current_country != 'undefined' && current_country != '') {
                                    if (country == current_country) {
                                        html += '<div style="' + $(this).data('style') + '" data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option">' +
                                            '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' +
                                            '</div>';
                                    }
                                } else {
                                    html += '<div style="' + $(this).data('style') + '" data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option">' +
                                        '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' +
                                        '</div>';
                                }
                            }
                        });
                        $('.option-wrapper').html(html).show();
                        t.caculatePosition($('.option-wrapper'), t);
                    } else {
                        html = '';
                        $('select option', parent).prop('selected', false);

                        $('select option', parent).each(function(index, el) {
                            var country = $(this).data('country');
                            var text = $(this).text();
                            var text_split = text.split("||");
                            text_split = text_split[0];
                            if (text != '') {
                                var current_country = $(this).parent('select').attr('data-current-country');
                                if (typeof current_country != 'undefined' && current_country != '') {
                                    if (country == current_country) {
                                        html += '<div style="' + $(this).data('style') + '" data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option">' +
                                            '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' +
                                            '</div>';
                                    }
                                } else {
                                    html += '<div style="' + $(this).data('style') + '" data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option">' +
                                        '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' +
                                        '</div>';
                                }
                            }
                        });
                        $('.option-wrapper').html(html).show();
                        t.caculatePosition($('.option-wrapper', parent), t);
                    }
                }

                if (event.which == 13) {
                    //$('.option-wrapper .option').trigger('click');
                    //console.log('Event2');
                    //return false;
                    /*html = '';
                    $('select option', parent).prop('selected', false);

                    $('select option', parent).each(function(index, el) {
                        var country = $(this).data('country');
                        var text = $(this).text();
                        var text_split = text.split("||");
                        text_split = text_split[0];
                        if (text != '') {
                            var current_country = $(this).parent('select').attr('data-current-country');
                            if (typeof current_country != 'undefined' && current_country != '') {
                                if (country == current_country) {
                                    html += '<div data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option">' +
                                        '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' +
                                        '</div>';
                                }
                            } else {
                                html += '<div data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option">' +
                                    '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' +
                                    '</div>';
                            }
                        }
                    });
                    $('.option-wrapper').html(html).show();
                    t.caculatePosition($('.option-wrapper'),t);*/
                }
                if (event.which == 13 && val != "") {

                }
                if (typeof t.data('children') != 'undefined' && t.data('children') != "") {
                    name = t.data('children');
                    $('select[name="' + name + '"]', form).attr('data-current-country', '');
                    $('input[name="drop-off"]', form).val('');
                    $('select[name="' + name + '"] option', form).prop('selected', false);
                }
            }
        });

        var liSelected;
        t.keydown(function(event) {
            last_select_clicked = t;
            if (event.which == 13) {
                /*var text = t.val();
                var val = $('div.option-wrapper .option.active').data('value');
                var country = $('div.option-wrapper .option.active').data('country');
                if( typeof text != 'undefined' && typeof val != 'undefined' ){
                    t.val(text);
                    $('select option[value="' + val + '"]').prop('selected', true);

                    $('.option-wrapper').html('').hide();

                    if (typeof t.data('children') != 'undefined' && t.data('children') != "") {
                        name = t.data('children');
                        $('select[name="' + name + '"]', form).attr('data-current-country', country);
                    }
                }*/
                var form = last_select_clicked.closest('form');
                $('.option-wrapper').html('').hide();
                t.focusNextInputField();

                return false;
            }

            if (event.which == 9) {
                var form = last_select_clicked.closest('form');
                $('.option-wrapper').html('').hide();
                //t.focusNextInputField();
                return false;
            }

            if (event.which == 40 || event.which == 38 || event.which == 9) {
                if (event.which === 40) {
                    var index = $('.option-wrapper .option.active').index();
                    if (liSelected) {
                        liSelected.removeClass('active');
                        next = liSelected.next();
                        if (next.length > 0) {
                            liSelected = next.addClass('active');
                        } else {
                            if ($('.option-wrapper .option.active').length > 0) {
                                $('.st-option-wrapper .option').eq(index).removeClass('active');
                                if (($('.option-wrapper .option').length - 1) == index) {
                                    liSelected = $('.st-option-wrapper .option').eq(0).addClass('active');
                                } else {
                                    liSelected = $('.st-option-wrapper .option').eq(index + 1).addClass('active');
                                }
                            } else {
                                liSelected = $('.st-option-wrapper .option').eq(0).addClass('active');
                            }
                        }
                    } else {
                        liSelected = $('.st-option-wrapper .option').eq(0).addClass('active');
                    }
                } else if (event.which === 38) {
                    var index = $('.option-wrapper .option.active').index();
                    if (liSelected) {
                        liSelected.removeClass('active');
                        next = liSelected.prev();
                        if (next.length > 0) {
                            liSelected = next.addClass('active');
                        } else {
                            if ($('.option-wrapper .option.active').length > 0) {
                                $('.st-option-wrapper .option').eq(index).removeClass('active');
                                liSelected = $('.st-option-wrapper .option').eq(index - 1).addClass('active');
                            } else {
                                liSelected = $('.st-option-wrapper .option').last().addClass('active');
                            }
                        }
                    } else {
                        liSelected = $('.st-option-wrapper .option').last().addClass('active');
                    }
                }

                $('.option-wrapper').scrollTo($('.option-wrapper .option.active'), 400);

                event.preventDefault();
                flag = true;

                var value = $('.option-wrapper .option.active').data('value');
                var text = $('.option-wrapper .option.active').text();

                var country = $('.option-wrapper .option.active').data('country');
                t.val(text);
                $('select option[value="' + value + '"]', parent).prop('selected', true);


                if (typeof t.data('children') != 'undefined' && t.data('children') != "") {
                    name = t.data('children');
                    $('select[name="' + name + '"]', form).attr('data-current-country', country);
                }
            }

        });
        t.blur(function(event) {
            if (t.data('clear') == 'clear' && $('select option:selected', parent).val() == "") {
                t.val('');
            }
        });
        t.on("focus", function(event) {
            if (t.data('id') != 'location_origin' && t.data('id') != 'location_destination') {
                last_select_clicked = t;
            }
            //last_select_clicked=t;
            //if (t.val() == '') {
            html = '';
            $('select option', parent).prop('selected', false);

            $('select option', parent).each(function(index, el) {
                var country = $(this).data('country');
                var text = $(this).text();
                var text_split = text.split("||");
                text_split = text_split[0];

                var activeOption = '';

                if (text != '') {
                    var current_country = $(this).parent('select').attr('data-current-country');
                    if (typeof current_country != 'undefined' && current_country != '') {
                        if (country == current_country) {
                            html += '<div style="' + $(this).data('style') + '" data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option ' + activeOption + '">' +
                                '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' +
                                '</div>';
                        }
                    } else {
                        html += '<div  style="' + $(this).data('style') + '" data-text="' + text + '" data-country="' + country + '" data-value="' + $(this).val() + '" class="option ' + activeOption + '">' +
                            '<span class="label"><a href="#">' + text_split + '<i class="fa fa-map-marker"></i></a>' +
                            '</div>';
                    }
                }
            });

            if (typeof t.data('parent') != 'undefined' && t.data('parent') != "") {
                name = t.data('parent');

                if ($('select[name="' + name + '"]', form).length) {
                    var val = $('select[name="' + name + '"]', form).parent().find('input.st-location-name').val();
                    if (typeof val == 'undefined' || val == '') {
                        t.val('');
                        $('select[name="' + name + '"]', form).parent().find('input.st-location-name').focus();
                    } else {
                        $('.option-wrapper').html(html).show();
                    }
                }
            } else {
                $('.option-wrapper').html(html).show();
            }
            //}

            t.caculatePosition();
        });
        $(document).on('click', '.option-wrapper .option', function(event) {
            if (last_select_clicked.length > 0) {
                var form = last_select_clicked.closest('form');
                var parent = last_select_clicked.closest('.st-select-wrapper');
                setTimeout(function() {
                    if (typeof form.find('input[name="start"]').attr('value') != 'undefined') {
                        var $tmp = form.find('input[name="start"]').attr('value');
                        if ($tmp.length <= 0) {
                            form.find('input[name="start"]').datepicker('show');
                        }
                    }
                }, 100);
                event.preventDefault();
                flag = true;

                var value = $(this).data('value');
                var text = $(this).text();
                var country = $(this).data('country');
                if (text != "") {

                    last_select_clicked.val(text);

                    $('select option[value="' + value + '"]', parent).prop('selected', true);

                    $('.option-wrapper').html('').hide();

                    if (typeof t.data('children') != 'undefined' && t.data('children') != "") {
                        name = t.data('children');
                        $('select[name="' + name + '"]', form).attr('data-current-country', country);
                    }
                }
            }

            last_select_clicked.focusNextInputField();

        });
        $(document).click(function(event) {
            if (!$(event.target).is('.st-location-name')) {
                $('.option-wrapper').html('').hide();
            }
        });
        t.caculatePosition = function() {
            if (!last_select_clicked || !last_select_clicked.length) return;
            var parent = $(this).parents('.st-select-wrapper');
            console.log(parent.height());
            var wraper = $('.option-wrapper');
            var input_tag = last_select_clicked;
            var offset = parent.offset();
            var top = offset.top + parent.height();
            var left = offset.left;
            var width = input_tag.outerWidth();
            var wpadminbar = 0;
            if ($('#wpadminbar').length && $(window).width() >= 783) {
                wpadminbar = $('#wpadminbar').height();
            } else {
                wpadminbar = 0
            }
            if ($('body').hasClass('boxed')) {
                left = left - $('body').offset().left;
            }

            top = top - wpadminbar;

            var z_index = 99999;
            var position = 'absolute';

            if ($('#search-dialog').length) {
                position = 'fixed';
                top = top + wpadminbar - $(window).scrollTop();
                z_index = 99999;
            }


            wraper.css({
                position: position,
                top: top,
                left: left,
                width: width,
                'z-index': z_index
            });
        };

        $(window).resize(function() {
            t.caculatePosition();
        });
        form.submit(function(event) {

            if (t.val() == "" && t.hasClass('required')) {
                t.focus();
                return false;
            } else {
                if ($('input.required-field').length && $('input.required-field').prop('checked') == true) {
                    var val = $('select[name="location_id_pick_up"] option:selected', form).val();
                    var text = $('input[name="pick-up"]', form).val();
                    $('select[name="location_id_drop_off"] option[value="' + val + '"]', form).prop('selected', true);
                    $('input[name="drop-off"]', form).val(text);
                }
                if ($('input.required-field').length && $('input.required-field').prop('checked') == false && $('input[name="drop-off"]', form).val() == "") {
                    $('input[name="drop-off"]', form).focus();
                    $('select[name="location_id_drop_off"] option', form).prop('selected', false);
                    return false;
                }
            }
        });
    });

    function get_highlight(text, val) {
        var highlight = text.replace(
            new RegExp(val + '(?!([^<]+)?>)', 'gi'),
            '<span class="highlight">$&</span>'
        );
        return highlight;
    }

    $.fn.focusNextInputField = function() {
        return this.each(function() {
            var fields = $(this).parents('form:eq(0),body').find('button:visible,input:visible,textarea:visible,select:visible');
            var index = fields.index(this);
            if (index > -1 && (index + 1) < fields.length) {
                fields.eq(index + 1).focus();
            }
            return false;
        });
    };


    /*Booking DC*/
    jQuery(document).ready(function ($) {
        //Booking now in single hotel
        /*$(document).on('click', '.btn_hotel_booking', function (e) {
            e.preventDefault();
            $('#bookingRoomNow').modal('show');
        });
        $('#bookingRoomNow').modal('show');*/
        $('.bookingdc-num-children').change(function () {
            var t = $(this);
            var af = $('.bookingdc-age-children');

            var number_child = t.val();

            if (number_child > 0) {
                var te = '';
                for (var i = 0; i < number_child; i++) {
                    te += '<select name="age">';
                    for (var j = 0; j < 18; j++) {
                        te += '<option value="' + j + '">' + j + '</option>';
                    }
                    te += '</select>';
                }
                af.show().children('#bookingdc-age-select').html(te);
            } else {
                af.hide().children('#bookingdc-age-select').html('');
            }
        });

        $('.bookingdc-start').change(function () {
            $('input[name="checkin_monthday"]').remove();
            $('input[name="checkin_month"]').remove();
            $('input[name="checkin_year"]').remove();

            var start = $(this).datepicker("getDate");
            var ci_dd = start.getDate();
            var ci_mm = start.getMonth() + 1;
            var ci_yy = start.getFullYear();

            var ci_te = '';

            if ($('input[name="checkin_monthday"]').length == 0 && $('input[name="checkin_month"]').length == 0 && $('input[name="checkin_year"]').length == 0) {
                ci_te += '<input type="hidden" name="checkin_monthday" value="' + ci_dd + '"/>';
                ci_te += '<input type="hidden" name="checkin_month" value="' + ci_mm + '"/>';
                ci_te += '<input type="hidden" name="checkin_year" value="' + ci_yy + '"/>';
                $('.main-bookingdc-search').append(ci_te);
            }
        });

        $('.bookingdc-end').change(function () {
            $('input[name="checkout_monthday"]').remove();
            $('input[name="checkout_month"]').remove();
            $('input[name="checkout_year"]').remove();

            var end = $(this).datepicker("getDate");
            var co_dd = end.getDate();
            var co_mm = end.getMonth() + 1;
            var co_yy = end.getFullYear();

            var co_te = '';

            if ($('input[name="checkout_monthday"]').length == 0 && $('input[name="checkout_month"]').length == 0 && $('input[name="checkout_year"]').length == 0) {
                co_te += '<input type="hidden" name="checkout_monthday" value="' + co_dd + '"/>';
                co_te += '<input type="hidden" name="checkout_month" value="' + co_mm + '"/>';
                co_te += '<input type="hidden" name="checkout_year" value="' + co_yy + '"/>';

                $('.main-bookingdc-search').append(co_te);
            }
        });
    });

    $('.form-group-select-plus').each(function () {
        var self     = $(this),
            btnGroup = self.find('.btn-group').first(),
            select   = self.find('select');

        if (btnGroup.children('label').last().index() == 3) {
            btnGroup.children('label').last().click(function () {
                btnGroup.addClass('hidden');
                select.removeClass('hidden');
            });
        }

        btnGroup.children('label').click(function () {
            var c = $(this);
            select.find('option[value=' + c.children('input').val() + ']').prop('selected', 'selected');
            if (!c.hasClass('active'))
                select.trigger('change');
        });
    });
    /*Date start and end*/
    $('.input-daterange input[name="start"]').each(function () {
        var form = $(this).closest('form');
        var me = $(this);
        $(this).datepicker({
            language      : st_params.locale,
            autoclose     : true,
            todayHighlight: true,
            startDate     : 'today',
            format        : $('.main-bookingdc-search [data-date-format]').data('date-format'),
            weekStart     : 1,
        }).on('changeDate', function (e) {

            var new_date = e.date;
            new_date.setDate(new_date.getDate() + 1);

            $('.input-daterange input[name="end"]', form).datepicker("remove");

            $('.input-daterange input[name="end"]', form).datepicker({
                language      : st_params.locale,
                startDate     : '+1d',
                format        : $('.main-bookingdc-search [data-date-format]').data('date-format'),
                autoclose     : true,
                todayHighlight: true,
                weekStart     : 1
            });
            $('.input-daterange input[name="end"]', form).datepicker('setDates', new_date);
            $('.input-daterange input[name="end"]', form).datepicker('setStartDate', new_date);
        });

        $('.input-daterange input[name="end"]', form).datepicker({
            language      : st_params.locale,
            startDate     : '+1d',
            format        : $('.main-bookingdc-search [data-date-format]').data('date-format'),
            autoclose     : true,
            todayHighlight: true,
            weekStart     : 1
        });
    });


    /*Loadmore*/
    $('.st-loadmore.loadmore-ccv').each(function () {
            st_nav_tab($(this));
        });
        function st_nav_tab(el){
            //var append_load = '<div id="morefloatingBarsG"><div class="ngothoai-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
            var append_load = '<div class="loader-wrapper"><div class="st-loader"></div></div>';
            el.find(".load_more_post").on('click',function(element) {
                element.preventDefault();
                var element = $(this);
                var posts_per_page = element.attr('data-posts-per-page');
                var paged = element.attr('data-paged');
                var data_id_service = element.attr('data-id_service');
                var max_num_page = element.attr('data-max-num-page');
                var check_all = element.attr('check-all');
                var type_service = element.attr('type_service');
                var $container = element.closest('.st_service_load');
                var offloadmore = $container.find('.loadmore');
                
                if(check_all === "true"){
                    var append_content = $container.find('.st_all');
                    var append_st = $container.find('.row');
                    var loadmore = $container.find('.st_all .load-ajax-icon .loader-wrapper');
                    var offloadmore = $container.find('.st_all .loadmore ');
                    var buttonloadmore = append_content.find('.st-button-loadmore');
                } else {
                    var append_content = $container.find('.st_blog_'+tax_query);
                    var append_st = $container.find('.row');
                    
                    
                    var buttonloadmore = $container.find('.st-button-loadmore');
                }
                var append_st = $container.find('.services-grid > .row');
                var loadmore = $container.find('.load-ajax-icon .loader-wrapper');
                var offloadmore = $container.find('.loadmore');
                var buttonloadmore = $container.find('.st-button-loadmore');

                $('.st-loadmore .loader-wrapper').show();
                $.ajax({
                    url: st_params.ajax_url,
                    type: "POST",
                    data: {
                        'action': "st_load_more_service_by_id",
                        'posts_per_page': posts_per_page,
                        'paged': paged,
                        'data_id_service': data_id_service,
                        'max_num_page': max_num_page,
                        'check_all': check_all,
                        'type_service': type_service
                    },
                    dataType: "json",
                    beforeSend: function () {
                        loadmore.show();
                        buttonloadmore.hide();
                    },
                    error : function(jqXHR, textStatus, errorThrown) {
                          $("#aLoad").remove();
                          console.log("ERRO" +jqXHR + "is" + errorThrown );
                        },
                    success : function(res){
                        $datxa = $(res.html);
                        if($datxa.length){
                              append_st.append(res.html);

                        } else {
                            
                        }
                        $container.animate({ scrollTop: $container.prop("scrollHeight")}, 1000);
                    },
                    complete: function (xhr, status) {
                       
                        $data = $(xhr.responseJSON.html);
                         console.log(xhr);
                        if($data.length){
                            element.attr('data-paged', xhr.responseJSON.paged);
                            element.attr('data-index', xhr.responseJSON.index);
                            loadmore.hide();
                            buttonloadmore.show();
                        } else {
                            loadmore.hide();
                            offloadmore.remove();
                        }

                    }
                });
                
            });
        }
});



