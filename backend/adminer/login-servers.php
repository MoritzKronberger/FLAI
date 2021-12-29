<?php
require_once('plugins/login-servers.php');

/**
 * Slightly modified from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01
 * to use docker env variables.
 */
return new AdminerLoginServers
([ 'CustomServer' => 
    [ 'server' => $_ENV['ADMINER_DEFAULT_SERVER'],
	  'driver' => $_ENV['ADMINER_DEFAULT_DB_DRIVER']
    ]
]);