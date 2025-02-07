<?php
$start = STInput::get('start',"");
$end = STInput::get('end',"");
$date = STInput::get('date', date('d/m/Y h:i a'). '-'. date('d/m/Y h:i a', strtotime('+1 day')));
$has_icon = (isset($has_icon))? $has_icon: false;
if(!empty($start)){
    $starttext = $start;
    $start = $start;
} else {
    $starttext = TravelHelper::getDateFormatMoment();
    $start = "";
}

if(!empty($end)){
    $endtext = $end;
    $end = $end;
} else {
    $endtext = TravelHelper::getDateFormatMoment();
    $end = "";
}
?>
<div class="form-group form-date-field form-date-search clearfix <?php if($has_icon) echo ' has-icon '; ?>" data-format="<?php echo TravelHelper::getDateFormatMoment() ?>">
    <?php
        if($has_icon){
            echo TravelHelper::getNewIcon('ico_calendar_search_box');
        }
    ?>
    <div class="date-wrapper clearfix">
        <div class="check-in-wrapper">
            <label><?php echo __('Check In - Out', ST_TEXTDOMAIN); ?></label>
            <div class="render check-in-render"><?php echo $starttext; ?></div><span> - </span><div class="render check-out-render"><?php echo $endtext; ?></div>
        </div>
    </div>
    <input type="hidden" class="check-in-input" value="<?php echo esc_attr($start) ?>" name="start">
    <input type="hidden" class="check-out-input" value="<?php echo esc_attr($end) ?>" name="end">
    <input type="text" class="check-in-out" value="<?php echo esc_attr($date); ?>" name="date">
</div>