/**
 * Reports by project
 *
 * @version 0.8.2
 * @author Sergey Nabiulin <nabiulin@nixsolutions.com>
 */
var reports = {
    /**
     * Bind events
     */
    init: function() {
        $('#show-filter').click(function(){
	  $('#filter-dialog').dialog();
            
        });
        $('#filter-close').click(function(){
           $('#filter-dialog').dialog('close');
        });

        $('#filter-apply').click(reports.filter.apply);

        $('#dates').dateswitcher({
            ajax: {
                url: function() {
		  
		},
                success: reports.render
            },
            locale: 'ru'
        });

        //workaround for hiding datepicker border
       $('div.ui-widget-content').css('border', 'none');

       $('#filter-from, #filter-to').datepicker(datepickerOptions);
    },

    /**
    * Render content to page
    */
    render: function(response) {
        var container = $('#report-content');
        container.empty();
        var table = '';
        if (response.count > 0) {
            table += '<table class="loading reported-hours" width="100%">';
            var width = Math.round(90 / (response.count + 1));
            response.data.total = new Object;
            table += '<tr>';
            table += '<td>&nbsp;</td>';
            $.each(response.data.projects, function(key, project) {
                table += '<td class="loading-td-names height30" width="' + width + '%">' + project + '</td>';
                response.data.total[key] = 0;
            });
            table += '<td class="loading-td-names height30" width="' + width + '%">' + response.translates.total + '</td>';
            table += '</tr>';
            $.each(response.data.hours, function(date, reported) {
                var  summ = 0;
                table += '<tr>';
                table += '<td class="loading-td-names height30">' + date + '</td>';
                $.each(response.data.projects, function(key, project) {
                    table += '<td class="loading-td height30">';
                    if (array_key_exists(key, reported)) {
                        table += reported[key];
                        summ += Number(reported[key]);
                        response.data.total[key] += Number(reported[key]);
                    } else {
                        table += '&nbsp;';
                    }
                    table += '</td>';
                });
                table += '<td class="loading-td height30"><b>' + summ + '</b></td>';
                table += '</tr>';
            });
            table += '<tr>';
            table += '<td class="loading-td-names height30"><b>' + response.translates.total + '</b></td>';
            var summ = 0;
            $.each(response.data.total, function(key, total) {
                table += '<td class="loading-td height30"><b>' + total + '</b></td>';
                summ += total;
            });
            table += '<td class="loading-td-names height30"><b>' + summ + '</b></td>';
            table += '</tr>';
            table += '</table>';

        } else {
            table += '<div class="messageArea block-hd">' + response.translates.empty + '</div>';
        }
        container.append(table);
    }
}

/**
 * Filter actions
 */
reports.filter = {
    /**
     * Apply filter
     */
    apply: function() {
        var from = $('#filter-year').find('option:selected').val();
        var to = $('#filter-month').find('option:selected').val();

        $.ajax({
           url: baseUrl + '/reports/index/projects',
           dataType: 'json',
           data: 'from=' + from + '&to=' + to,
           success: function(response) {
               reports.render(response);
               layout.dialog.close('filter-dialog');
           }
        });
    }
}

/**
 * Check for array key exists
 */
function array_key_exists (key, search) {
    if(!search || (search.constructor !== Array && search.constructor !== Object)){
        return false;
    }
    return search[key] !== undefined;
}

$(document).ready(function(){
    reports.init();
});