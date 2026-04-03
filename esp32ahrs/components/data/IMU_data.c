#include "IMU_data.h"

#include <string.h>
#include <stdio.h>

#include "config.h"
#include "gyroscope_data.h"
#include "accelerometer_data.h"
//----------------------------------------------------------------------
int IMU_data2json(char *json_str, size_t json_str_len, IMU_data_t *data)
{
	char g_json_str[50];
	gyroscope_data2json(g_json_str, json_str_len, &(data->g));

	char a_json_str[50];
	accelerometer_data2json(a_json_str, json_str_len, &(data->a));

	return snprintf(json_str, json_str_len,
					"{\"g\":%s,\"a\":%s}",
					g_json_str, a_json_str);
}
//----------------------------------------------------------------------
