// Table update

export function dataUpdate(data) {

	const g_table = document.getElementById('table_g');
	
	if (!g_table) {
        //console.warn('data-table not found');
        return;
    }

	g_table.innerHTML = `<tr><td>X</td><td>${data.imu.g.x.toFixed(2)}</td></tr>
					     <tr><td>Y</td><td>${data.imu.g.y.toFixed(2)}</td></tr>
					     <tr><td>Z</td><td>${data.imu.g.z.toFixed(2)}</td></tr>`;
    //return ;
}



