/**
 * @file
 */

(function ($, Drupal) {

  "use strict";

    $(document).ready(function () {

        var dsg1, dsg2, dsg3, dsg4, dsg5, dsg6, dsg7, dsg8, dsg9, dsg10, dsg11, dsg12, dsg13;
        var dbPerf1, dbPerf2, dbPerf3, dbPerf4;

        var timer = setInterval(function () {

            $('#site-commander-loading-message-container').fadeOut('medium', function () {

                // Tag cloud.
                $.fn.tagcloud.defaults = {
                    size: {start: 11, end: 18, unit: 'pt'},
                    color: {start: drupalSettings.settings.sitecommander.tagCloudStartingColor, end: drupalSettings.settings.sitecommander.tagCloudEndingColor}
                };

                $('#tag-cloud a').tagcloud(
                    {
                        size: {start: 11, end: 18, unit: 'pt'},
                        color: {start: drupalSettings.settings.sitecommander.tagCloudStartingColor, end: drupalSettings.settings.sitecommander.tagCloudEndingColor}
                    },
                    function (options) {

                        $('#tag-cloud').fadeIn('slow');
                    }
                );

                $('#btnBroadcast').click(function () {
                    $.ajax({
                        url: '/sitecommander/broadcastMessage',
                        method: 'POST',
                        data: {
                            messageType: $('input[name=messageType]:checked').val(),
                            messagePosition: $('input[name=messagePosition]:checked').val(),
                            messageBody: $('#messageBody').val()
                        },
                    }).done(function (data) {
                    });
                });

                $('#site-commander-tabs a[data-toggle="tab"]').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                })

                $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    document.getElementById('sitecommander-click').cloneNode(true).play();
                })

                // Enable link to tab.
                var url = document.location.toString();
                if (url.match('#')) {
                    $('#site-commander-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
                }

                // Change hash for page-reload.
                $('.nav-tabs a').on('shown.bs.tab', function (e) {
                    window.location.hash = e.target.hash;
                })

                $('a[data-toggle=modal], button[data-toggle=modal]').click(function () {
                    var data_id = '';
                    if (typeof $(this).attr('data-source-image') !== 'undefined') {
                        data_id = $(this).attr('data-source-image');
                        $('#dataSourceImage').html(data_id);
                    }
                });

                $('#btn-start-backup').click(function () {
                    $('#modalBackup').find('.modal-body').html('<h3 class="white text-center">Working ...</h3><div class="progress"> <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div> </div> ');

                    $('#modalBackup').find('.modal-footer').html('');

                    $.ajax({
                        url: '/sitecommander/make-backup',
                        dataType: 'json'
                    }).done(function (data) {
                        $('#modalBackup').find('.modal-body').html('<h2 class="white text-center"><span class="fa fa-check-square"></span> Backup Complete!</h2><p>Your backup image file should now be visible in the list of completed backups!');
                        $('#modalBackup').find('.modal-footer').html('<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                        $('#modalBackup').attr('data-modal-color', 'green');

                        // Append the new backup file to the list of backup images.
                        var rowId = data[0].responseData.rowId;
                        var fileName = data[0].responseData.fileName;
                        var fileSize = data[0].responseData.fileSize;
                        var fileDate = data[0].responseData.fileDate;
                        $('#table-backup-images').find('tbody').prepend('<tr id="' + rowId + '"><td>' + fileName + '</td><td>' + fileDate + '</td><td>' + fileSize + '</td><td><a class="btn btn-sm btn-primary pull-left" role="button" data-toggle="modal" data-target="#modalRestore" data-source-image="' + rowId + '"><span class="fa fa-trash"></span> Restore</a><a class="btn btn-sm btn-danger pull-right use-ajax" href="/sitecommander/delete-backup/' + rowId + '"><span class="fa fa-trash"></span> Delete</a></td></tr>');

                        Drupal.attachBehaviors();

                        document.getElementById('sitecommander-task-complete').cloneNode(true).play();
                    });
                });

                $('#btn-start-backup-background').click(function () {
                    $.ajax({
                        url: '/sitecommander/make-backup-background/' + rowId,
                        dataType: 'json'
                    });

                    $('#modalBackupBackground').modal('hide');
                    $('#btn-create-backup').addClass('disabled');
                    $('#btn-create-backup-background').addClass('disabled');

                });

                $('#btn-start-restore').click(function () {
                    $.ajax({
                        url: '/sitecommander/restore-backup/' + $('#dataSourceImage').text(),
                        dataType: 'json'
                    }).done(function (data) {
                        $('#modalRestore').find('.modal-body').html('<h2 class="white text-center">Backup Complete!</h2><p>Your restore job has completed!');
                        $('#modalRestore').find('.modal-footer').html('<button type="button" class="btn btn-success" data-dismiss="modal">Close</button>');
                        $('#modalRestore').attr('data-modal-color', 'green');
                        document.getElementById('sitecommander-task-complete').cloneNode(true).play();
                    });
                });

                $('[data-feature="tooltip"]').tooltip({ trigger: 'hover' });

                $('.switch-users-online').click(function (e) {
                    e.preventDefault();
                    $('#site-commander-tabs a[href="#users-online"]').tab('show');
                });

                $('.switch-backup-manager').click(function (e) {
                    e.preventDefault();
                    $('#site-commander-tabs a[href="#backup-manager"]').tab('show');
                });

                $('.switch-sessions').click(function (e) {
                    e.preventDefault();
                    $('#site-commander-tabs a[href="#sessions"]').tab('show');
                });

                $('#reloadLink').click(function (e) {
                    e.preventDefault();
                    location.reload(true);
                });

                dsg1 = new JustGage({
                    id: 'loadAverageRaw1',
                    value: drupalSettings.loadAverage[0] * 100,
                    min: 0,
                    max: 100,
                    title: 'Raw Load Avg (1 min)',
                    label: 'Percentage'
                });

                dsg2 = new JustGage({
                    id: 'loadAverageRaw2',
                    value: drupalSettings.loadAverage[1] * 100,
                    min: 0,
                    max: 100,
                    title: 'Raw Load Avg (5 min)',
                    label: 'Percentage'
                });

                dsg3 = new JustGage({
                    id: 'loadAverageRaw3',
                    value: drupalSettings.loadAverage[2] * 100,
                    min: 0,
                    max: 100,
                    title: 'Raw Load Avg (15 min)',
                    label: 'Percentage'
                });

                dsg11 = new JustGage({
                    id: 'loadAverageAdj1',
                    value: drupalSettings.loadAverage[3] * 100,
                    min: 0,
                    max: 100,
                    title: 'Adj Load Avg (1 min)',
                    label: 'Percentage'
                });

                dsg12 = new JustGage({
                    id: 'loadAverageAdj2',
                    value: drupalSettings.loadAverage[4] * 100,
                    min: 0,
                    max: 100,
                    title: 'Adj Load Avg (5 min)',
                    label: 'Percentage'
                });

                dsg13 = new JustGage({
                    id: 'loadAverageAdj3',
                    value: drupalSettings.loadAverage[5] * 100,
                    min: 0,
                    max: 100,
                    title: 'Adj Load Avg (15 min)',
                    label: 'Percentage'
                });

                if (drupalSettings.apcStats) {
                    dsg4 = new JustGage({
                        id: 'apcOpcacheStatus',
                        value: drupalSettings.apcStats.hits,
                        min: 0,
                        max: drupalSettings.apcStats.hits + drupalSettings.apcStats.misses,
                        levelColors: ['#ff0000', '#f9c802', '#a9d70b'],
                        title: 'APC Cache Hits',
                        label: 'Cache Hits'
                    });

                    dsg5 = new JustGage({
                        id: 'apcMemoryUsage',
                        value: drupalSettings.apcStats.used,
                        min: 0,
                        max: drupalSettings.apcStats.totalMem,
                        title: 'APC Memory Usage (MB)',
                        label: 'Cache Size >>'
                    });
                }

                if (drupalSettings.redisStats) {
                    dsg6 = new JustGage({
                        id: 'redisKeyspaceHits',
                        value: drupalSettings.redisStats.keyspaceHitPct,
                        min: 0,
                        max: 100,
                        title: 'Keyspace Hits',
                        levelColors: ['#ff0000', '#f9c802', '#a9d70b'],
                        label: 'Percentage'
                    });

                    dsg7 = new JustGage({
                        id: 'redisMemoryUsage',
                        value: drupalSettings.redisStats.memoryUsedByRedis,
                        min: 0,
                        max: drupalSettings.redisStats.memoryAllocatedByRedis,
                        title: 'Memory Usage (MB)',
                        levelColors: ['#a9d70b'],
                        label: 'Cache Size >>',
                humanFriendlyDecimal: 2,
                decimals: 2
                    });

                    dsg8 = new JustGage({
                        id: 'redisPeakMemoryUsage',
                        value: drupalSettings.redisStats.peakMemoryUsedByRedis,
                        min: 0,
                        max: drupalSettings.redisStats.memoryAllocatedByRedis,
                        title: 'Peak Memory Usage (MB)',
                        levelColors: ['#a9d70b'],
                        label: 'Cache Size >>',
                humanFriendlyDecimal: 2,
                decimals: 2
                    });
                }

                if (drupalSettings.opCacheStats) {
                    dsg9 = new JustGage({
                        id: 'opCacheHits',
                        value: drupalSettings.opCacheStats.opcache_statistics.opcache_hit_rate,
                        min: 0,
                        max: 100,
                        title: 'Keyspace Hits',
                        levelColors: ['#ff0000', '#f9c802', '#a9d70b'],
                        label: 'Percentage'
                    });

                    dsg10 = new JustGage({
                        id: 'opCacheMemoryUsage',
                        value: drupalSettings.opCacheStats.memory_usage.usedMemory,
                        min: 0,
                        max: drupalSettings.opCacheStats.memory_usage.allocatedMemory,
                        title: 'Memory Usage (MB)',
                        levelColors: ['#a9d70b', '#a9d70b', '#f9c802', '#ff0000'],
                        label: 'Cache Size >>'
                    });
                }

                // Database performance charts.
                if (drupalSettings.dbDriver == 'mysql') {
                    dbPerf1 = new JustGage({
                        id: 'dbPerf1',
                        value: drupalSettings.dbStats.max_used_connections,
                        min: 0,
                        max: drupalSettings.dbConfig.max_connections,
                        title: 'Max Used Connections',
                        label: '# Connections'
                    });

                    dbPerf2 = new JustGage({
                        id: 'dbPerf2',
                        value: (1 - ((drupalSettings.dbStats.key_blocks_unused * drupalSettings.dbConfig.key_cache_block_size) / drupalSettings.dbConfig.key_buffer_size)) * 100,
                        min: 0,
                        max: 100,
                        title: 'MyISAM Key Buffer Used',
                        levelColors: ['#a9d70b', '#a9d70b', '#f9c802', '#ff0000'],
                        label: 'Percentage'
                    });

                    dbPerf3 = new JustGage({
                        id: 'dbPerf3',
                        value: ((drupalSettings.dbStats.innodb_buffer_pool_pages_total - drupalSettings.dbStats.innodb_buffer_pool_pages_free) / drupalSettings.dbStats.innodb_buffer_pool_pages_total) * 100,
                        min: 0,
                        max: 100,
                        title: 'InnoDB Buffer Usage',
                        levelColors: ['#a9d70b', '#a9d70b', '#f9c802', '#ff0000'],
                        label: 'Percentage'
                    });

                    dbPerf4 = new JustGage({
                        id: 'dbPerf4',
                        value: drupalSettings.dbQueryCacheHitRatio,
                        min: 0,
                        max: 100,
                        title: 'Query Cache Hit Ratio',
                        label: 'Percentage'
                    });

                }

                clearInterval(timer);
            });
        }, 500);

        // Update gauges via Ajax periodically.
        setInterval(function () {

            // Sanity check, so we don't end up spamming AJAX calls if the refreshRate gets clobbered somehow.
            if (!drupalSettings.settings.sitecommander.refreshRate) {
                drupalSettings.settings.sitecommander.refreshRate = 60; }

            $.get('sitecommander/update-poll', function (response) {
                dsg1.refresh(response[0].responseData.payload.loadAverage[0] * 100);
                dsg2.refresh(response[0].responseData.payload.loadAverage[1] * 100);
                dsg3.refresh(response[0].responseData.payload.loadAverage[2] * 100);
                dsg11.refresh(response[0].responseData.payload.loadAverage[3] * 100);
                dsg12.refresh(response[0].responseData.payload.loadAverage[4] * 100);
                dsg13.refresh(response[0].responseData.payload.loadAverage[5] * 100);

                if (response[0].responseData.payload.apcStats) {
                    dsg4.refresh(response[0].responseData.payload.apcStats.hits, response[0].responseData.payload.apcStats.hits + response[0].responseData.payload.apcStats.misses);
                    dsg5.refresh(response[0].responseData.payload.apcStats.used, response[0].responseData.payload.apcStats.totalMem);
                }

                if (response[0].responseData.payload.redisStats) {
                    // dsg6.refresh(response[0].responseData.payload.redisStats.keyspaceHits, response[0].responseData.payload.redisStats.keyspaceTotal);.
                    dsg6.refresh(response[0].responseData.payload.redisStats.keyspaceHitPct);
                    dsg7.refresh(response[0].responseData.payload.redisStats.memoryUsedByRedis, response[0].responseData.payload.redisStats.memoryAllocatedByRedis);
                    dsg8.refresh(response[0].responseData.payload.redisStats.peakMemoryUsedByRedis, response[0].responseData.payload.redisStats.memoryAllocatedByRedis);
                }

                if (response[0].responseData.payload.opCacheStats) {
                    dsg9.refresh(response[0].responseData.payload.opCacheStats.opcache_statistics.opcache_hit_rate);
                    dsg10.refresh(response[0].responseData.payload.opCacheStats.memory_usage.usedMemory);
                }

                if (response[0].responseData.payload.dbStats && response[0].responseData.payload.dbDriver == 'mysql') {
                    dbPerf1.refresh(response[0].responseData.payload.dbStats.max_used_connections);
                    dbPerf2.refresh(
                        (1 - ((response[0].responseData.payload.dbStats.key_blocks_unused * response[0].responseData.payload.dbConfig.key_cache_block_size) / response[0].responseData.payload.dbConfig.key_buffer_size)) * 100
                    );
                    dbPerf3.refresh(
                        ((response[0].responseData.payload.dbStats.innodb_buffer_pool_pages_total - response[0].responseData.payload.dbStats.innodb_buffer_pool_pages_free) / response[0].responseData.payload.dbStats.innodb_buffer_pool_pages_total) * 100
                    );
                    dbPerf4.refresh(response[0].responseData.payload.dbQueryCacheHitRatio);
                }

                // Update users online table (only do the fade effect if it is currently visible!)
                if ($('#users-online').is(':visible') && $('#users-online').hasClass('active')) {
                    $('#users-online').fadeOut(500, function () {
                        $(this).html(response[0].responseData.payload.usersOnlineTable).fadeIn(500);
                    });
                }
else {
                    $('#users-online').html(response[0].responseData.payload.usersOnlineTable);
                }

                // Update all other fields.
                $.each(response[0].responseData.payload, function (key, value) {

                    // console.log(key);
                    // console.log('Old: ' + $('#' + key).html());
                    // console.log('New: ' + value);
                    // Only dop the fade in/out effect if there is a change in value.
                    if ($('#' + key).html() != value) {
                        $('#' + key).fadeOut(500, function () {
                    $(this).html(value).fadeIn(500);
                        });
                    }
                });

            });
        }, drupalSettings.settings.sitecommander.refreshRate * 1000);

    });

})(jQuery, Drupal);
