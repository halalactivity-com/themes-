<?php
$start = STInput::post('check_in', date(TravelHelper::getDateFormat()));
$end = STInput::post('check_out', date(TravelHelper::getDateFormat(), strtotime("+ 1 day")));
$adult_number = STInput::post('adult_number', 1);
$child_number = STInput::post('child_number', 0);
$infant_number = STInput::post('infant_number', 0);
$tour_guest_adult = st()->get_option( 'tour_guest_adult', 'Age 18+' );
if(isset($tour_guest_adult) && !empty($tour_guest_adult)){
    $tour_guest_adult = st()->get_option( 'tour_guest_adult', 'Age 18+' );
} else {
    $tour_guest_adult = __( 'Age 18+', ST_TEXTDOMAIN );
}

$tour_guest_childrent = st()->get_option( 'tour_guest_childrent', 'Age 6-17' );
if(isset($tour_guest_childrent) && !empty($tour_guest_childrent)){
    $tour_guest_childrent = $tour_guest_childrent;
} else {
    $tour_guest_childrent = __( 'Age 6-17', ST_TEXTDOMAIN );
}
$tour_guest_infant = st()->get_option( 'tour_guest_infant', 'Age 0-5' );
if(isset($tour_guest_infant) && !empty($tour_guest_infant)){
    $tour_guest_infant = $tour_guest_infant;
} else {
    $tour_guest_infant = __( 'Age 0-5', ST_TEXTDOMAIN );
}
$max_people = get_post_meta(get_the_ID(), 'max_people', true);
if(empty($max_people) or $max_people <= 0)
    $max_people = 20;
$has_icon = (isset($has_icon))? $has_icon: false;

$hide_adult = get_post_meta(get_the_ID(), 'hide_adult_in_booking_form', true);
$hide_children = get_post_meta(get_the_ID(), 'hide_children_in_booking_form', true);
$hide_infant = get_post_meta(get_the_ID(), 'hide_infant_in_booking_form', true);
?>
<div class="form-group form-guest-search clearfix <?php if($has_icon) echo ' has-icon '; ?>">
    <?php
    if($has_icon){
        echo TravelHelper::getNewIcon('ico_calendar_search_box');
    }
    ?>
    <?php if($hide_adult != 'on'): ?>
    <div class="guest-wrapper clearfix">
        <div class="check-in-wrapper">
            <label><?php echo __('Adults', ST_TEXTDOMAIN); ?></label>
            <div class="render"><?php echo sprintf(__( '%s', ST_TEXTDOMAIN ),$tour_guest_adult); ?></div>
        </div>
        <div class="select-wrapper">
            <div class="st-number-wrapper">
                <input type="text" name="adult_number" value="<?php echo esc_html($adult_number); ?>" class="form-control st-input-number" autocomplete="off" readonly data-min="1" data-max="<?php echo esc_attr($max_people); ?>"/>
            </div>
        </div>
    </div>
    <?php endif; ?>
    <?php if($hide_children != 'on'): ?>
    <div class="guest-wrapper clearfix">
        <div class="check-in-wrapper">
            <label><?php echo __('Children', ST_TEXTDOMAIN); ?></label>
            <div class="render"><?php echo sprintf(__( '%s', ST_TEXTDOMAIN ),$tour_guest_childrent); ?></div>
        </div>
        <div class="select-wrapper">
            <div class="st-number-wrapper">
                <input type="text" name="child_number" value="<?php echo esc_html($child_number); ?>" class="form-control st-input-number" autocomplete="off" readonly data-min="0" data-max="<?php echo $max_people; ?>"/>
            </div>
        </div>
    </div>
    <?php endif; ?>
    <?php if($hide_infant != 'on'): ?>
    <div class="guest-wrapper clearfix">
        <div class="check-in-wrapper">
            <label><?php echo __('Infant', ST_TEXTDOMAIN); ?></label>
            <div class="render"><?php echo sprintf(__( '%s', ST_TEXTDOMAIN ),$tour_guest_infant); ?></div>
        </div>
        <div class="select-wrapper">
            <div class="st-number-wrapper">
                <input type="text" name="infant_number" value="<?php echo $infant_number; ?>" class="form-control st-input-number" autocomplete="off" readonly data-min="0" data-max="<?php echo $max_people; ?>"/>
            </div>
        </div>
    </div>
    <?php endif; ?>
</div>