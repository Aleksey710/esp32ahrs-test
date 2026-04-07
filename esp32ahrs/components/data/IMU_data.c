#include "IMU_data.h"

#include <string.h>
#include <stdio.h>

#include "config.h"
#include "gyroscope_data.h"
#include "accelerometer_data.h"
//----------------------------------------------------------------------
int IMU_data2json(char *json_str, size_t json_str_len, IMU_data_t *data)
{
	const size_t buf_size = 50;

	char g_json_str[buf_size];
	gyroscope_data2json(g_json_str, buf_size, &(data->g));

	char a_json_str[buf_size];
	accelerometer_data2json(a_json_str, buf_size, &(data->a));

	return snprintf(json_str, json_str_len,
					"{\"g\":%s,\"a\":%s}",
					g_json_str, a_json_str);
}
//----------------------------------------------------------------------
