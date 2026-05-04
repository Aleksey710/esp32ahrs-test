// AUTO-GENERATED TYPES

export interface base { type: string; timestamp: number }

export interface vector3 { x: number; y: number; z: number }

export interface imu { g: any; a: any }

export interface ahrs any & { type?: any; imu: any; m: any }

export interface heartbeat any & { type?: any }

export interface hello any & { type?: any; deviceId?: string; firmware?: string }

export interface acknowledge any & { type?: any; messageId?: string; status?: string }

