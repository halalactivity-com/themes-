<?php

/**

 * Created by PhpStorm.

 * User: HanhDo

 * Date: 1/17/2019

 * Time: 11:43 AM

 */

?>

<li class="dropdown hidden-xs hidden-sm">

    <form action="<?php echo home_url( '/' ); ?>" method="get" class="header-search">

        <input type="text" class="header-search-inp" name="s" value="<?php echo get_search_query(); ?>">

        <button type="submit"><i class="fa fa-search"></i></button>

    </form>

</li>

