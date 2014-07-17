//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'divide_pie';

            if (data.ext && data.ext["show"]) {
                var checkioInputStr = fname + "(" + data.ext["show"] + ")";
            }
            else {
                checkioInputStr = fname + '((2, -1, 3))';
            }

            var checkioInput = data.in;

            var failError = function (dError) {
                $content.find('.call').html('Fail: ' + checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var userResultShow = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + userResultShow);

            if (!result) {
                $content.find('.call').html('Fail: ' + checkioInputStr);
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: ' + checkioInputStr);
                $content.find('.answer').remove();
            }

            if (explanation) {
                var canvas = new Canvas($content.find(".explanation")[0]);
                canvas.draw();
                canvas.animate(explanation);
            }


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });
        function Canvas(dom) {


            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var padding = 10;

            var R = 150;

            var size = padding * 2 + R * 2;

            var center = size / 2

            var paper = Raphael(dom, size, size);

            var arc;

            var attrShadow = {"stroke": colorBlue2, "fill": colorGrey1, "stroke-width": 3};
            var attrPie = {"stroke": colorBlue4, "fill": colorBlue1, "stroke-width": 3};

            this.draw = function () {
                paper.circle(size / 2, size / 2, R).attr(attrShadow);
                arc = paper.path(Raphael.format(
                    "M{0},{0}L{0},{1}A{2},{2},{3},{4},1,{5},{6}Z",
                    center,
                    padding,
                    R,
                    Math.PI,
                    1,
                    center,
                    padding)).attr(attrPie);

            };

            this.animate = function (parts) {
                var i = 0;
                var stepTime = 500;
                var delayTime = 300;
                (function cut() {
                    i++;
                    if (i >= parts.length) return False;
                    setTimeout(function () {
                        var p = parts[i];
                        var angle = 2 * Math.PI * p[0] / p[1];
                        arc.animate({"path": Raphael.format(
                            "M{0},{0}L{0},{1}A{2},{2},{3},{4},1,{5},{6}Z",
                            center,
                            padding,
                            R,
                            Math.PI,
                            1,
                            center + Math.cos(angle) * R,
                            center + Math.sin(angle) * R)}, stepTime, callback = cut);
                    }, delayTime);
                })();

            }
        }

        //Your Additional functions or objects inside scope
        //
        //
        //


    }
);
