<?php
/**
 * @package WordPress
 * @subpackage Traveler
 * @since 1.1.0
 *
 * User hotel booking
 *
 * Created by ShineTheme
 *
 */
$format = TravelHelper::getDateFormat();
?>
<div class="st-create">
    <h2><?php _e("Hotel Booking", ST_TEXTDOMAIN) ?></h2>
    <?php
    $arr_query_arg = array(
        'sc' => 'booking-hotel',
        'scaction' => 'email-notification'
    );
    if (STInput::get('scaction') != 'email-notification') {
        ?>
        <a class="st_button_send_mail" href="<?php echo add_query_arg($arr_query_arg, get_permalink()); ?>"
           class="btn btn-primary btn-sm btn-sendmail-notice-link"
           title="<?php echo __('Send email notification depart date', ST_TEXTDOMAIN); ?>"><?php echo __('Send email notification', ST_TEXTDOMAIN); ?></a>
    <?php } ?>
</div>
<?php
$paged = get_query_var('paged') ? intval(get_query_var('paged')) : 1;
$limit = 10;
$offset = ($paged - 1) * $limit;
if (STInput::get('scaction') != 'email-notification') {
    $data_post = STUser_f::get_history_bookings('st_hotel', $offset, $limit, $data->ID);
} else {
    $data_post = STUser_f::get_history_bookings_send_mail('st_hotel', $offset, $limit, $data->ID);
}
$posts = $data_post['rows'];
$total = ceil($data_post['total'] / $limit);
if (STInput::get('scaction') == 'email-notification') {
    echo st()->load_template('user/user-booking-hotel', 'email', array('posts' => $posts, 'offset' => $offset));
} else {
    ?>
<div class="infor-st-setting">
    <table class="table table-bordered table-striped table-booking-history">
        <thead>
        <tr>
            <th  class="hidden-xs"><?php echo __('#ID', ST_TEXTDOMAIN); ?></th>
            <th  class="hidden-xs"><?php _e("Customer", ST_TEXTDOMAIN) ?></th>
            <th><?php _e("Hotel Name", ST_TEXTDOMAIN) ?></th>
            <th  class="hidden-xs"><?php _e("Check-in/Check-out", ST_TEXTDOMAIN) ?></th>
            <th  class="hidden-xs"><?php _e("Price", ST_TEXTDOMAIN) ?></th>
            <th  class="hidden-xs" width="10%"><?php _e("Order Date", ST_TEXTDOMAIN) ?></th>
            <th><?php _e("Status", ST_TEXTDOMAIN) ?></th>
            <th width="10%"><?php _e("Action", ST_TEXTDOMAIN) ?></th>
        </tr>
        </thead>
        <tbody id="data_history_book booking-history-title">
        <?php if (!empty($posts)) {
            $i = 1 + $offset;
            foreach ($posts as $key => $value) {
                $post_id = $value->wc_order_id;
                $item_id = $value->st_booking_id;
                ?>
                <tr>
                    <td class="hidden-xs"><?php echo $value->wc_order_id; ?></td>
                    <td class="hidden-xs" class="booking-history-type">
                        <?php
                        if ($post_id) {
                            $name = get_post_meta($post_id, 'st_first_name', true);
                            if (!empty($name)) {
                                $name .= " " . get_post_meta($post_id, 'st_last_name', true);
                            }
                            if (!$name) {
                                $name = get_post_meta($post_id, 'st_name', true);
                            }
                            if (!$name) {
                                $name = get_post_meta($post_id, 'st_email', true);
                            }
                            if (!$name) {
                                $name = get_post_meta($post_id, '_billing_first_name', true);
                                $name .= " " . get_post_meta($post_id, '_billing_last_name', true);
                            }
                            echo esc_html($name);
                        }
                        ?>
                    </td>
                    <td class=""> <?php
                        if ($item_id) {
                            if ($item_id) {
                                echo "<a href='" . get_the_permalink($item_id) . "' target='_blank'>" . get_the_title($item_id) . "</a>";
                            }
                        }
                        ?>
                    </td>
                    <td class="hidden-xs" >
                        <?php $date = $value->check_in;
                        if ($date) echo date('d/m/Y', strtotime($date)); ?><br>
                        <i class="fa fa-long-arrow-right"></i><br>
                        <?php $date = $value->check_out;
                        if ($date) echo date('d/m/Y', strtotime($date)); ?>
                    </td>
                    <td class="hidden-xs"> <?php
                        if ($value->type == "normal_booking") {
                            $total_price = get_post_meta($post_id, 'total_price', true);
                        } else {
                            $total_price = get_post_meta($post_id, '_order_total', true);
                        }
                        $currency = TravelHelper::_get_currency_book_history($post_id);
                        echo TravelHelper::format_money_raw($total_price, $currency);
                        ?>
                    </td>
                    <td class="hidden-xs"><?php echo date_i18n($format, strtotime($value->created)) ?></td>
                    <td class="">
                        <?php
                        $data_status = STUser_f::_get_order_statuses();
                        $status = 'pending';
                        if ($value->type == "normal_booking") {
                            $status = esc_html(get_post_meta($value->order_item_id, 'status', true));
                        } else {
                            $status = esc_html($value->status);
                        }
                        $data_status_all = STUser_f::_get_all_order_statuses();
                        $status_string = '';
                        if(array_key_exists($status, $data_status)){
	                        $status_string = $data_status[$status];
                        }else{
	                        if(array_key_exists($status, $data_status_all)){
		                        $status_string = $data_status_all[$status];
	                        }
                        }
                        switch ( $status_string ) {
                            case "Pending":
                            $status_string = '<span style="color:#E02020">'.__( 'Pending', ST_TEXTDOMAIN ).'</span>';
                            break;
                            case "Completed":
                            $status_string = '<span style="color:#10CD78">'.__( 'Completed', ST_TEXTDOMAIN ).'</span>';
                            break;
                            case "Incomplete":
                            $status_string = '<span style="color:#FFAD19">'.__( 'Incomplete', ST_TEXTDOMAIN ).'</span>';
                            break;
                            case "Cancelled":
                            $status_string = '<span style="color:#7A7A7A">'.__( 'Cancelled', ST_TEXTDOMAIN ).'</span>';
                            break;
                            default:
                        }
                        echo '<span class="suser-status">' . $status_string . '</span>';
                        if($status == 'incomplete'){
                            ?>
                            <a data-order-id="<?php echo $value->order_item_id; ?>" data-id="<?php echo $value->id; ?>" href="#" class="suser-approve"><?php echo __('Approve', ST_TEXTDOMAIN); ?> </a>
                            <div class="suser-message"><div class="spinner"></div></div>
                        <?php } ?>
                    </td>
                    <td class="text-center">
                        <a data-toggle="modal" data-target="#info-booking-modal"
                           class="btn btn-xs btn-primary mt5 btn-info-booking"
                           data-service_id='<?php echo esc_html($item_id) ?>'
                           data-order_id="<?php echo esc_html($post_id) ?>" href="javascript: void(0);"><i
                                    class="fa fa-info-circle"></i><span class="hidden-xs"><?php _e('Details', ST_TEXTDOMAIN) ?></span></a>
                    </td>
                </tr>
                <?php
                $i++;
            }
        } else {
            echo '<h5>' . st_get_language('no_hotel') . '</h5>';
        }
        ?>
        </tbody>
    </table>
</div>
<?php } ?>
<?php st_paging_nav('', null, $total) ?>
<div class="modal fade modal-cancel-booking modal-info-booking" id="info-booking-modal" tabindex="-1" role="dialog"
     aria-labelledby="cancelBookingLabel">
    <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"
                        aria-label="<?php echo __('Close', ST_TEXTDOMAIN); ?>"><span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title" id="cancelBookingLabel"><?php echo __('Booking Details', ST_TEXTDOMAIN); ?></h4>
            </div>
            <div class="modal-body">
                <div style="display: none;" class="overlay-form"><i class="fa fa-spinner text-color"></i></div>
                <div class="modal-content-inner"></div>
            </div>
        </div>
    </div>
</div>


