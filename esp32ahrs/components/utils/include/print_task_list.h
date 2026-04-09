#ifndef PRINT_TASK_LIST_H
#define PRINT_TASK_LIST_H
//----------------------------------------------------------------------
#include <inttypes.h>

//----------------------------------------------------------------------

//----------------------------------------------------------------------
static void print_run_time_stats(void);

static void print_free_stack(void);

void print_task_list_task_start(const int cpuId);
//----------------------------------------------------------------------
#endif // PRINT_TASK_LIST_H
