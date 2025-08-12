import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export class AgoraAPI {
  private appId: string;
  private appCertificate: string;

  constructor() {
    this.appId = process.env.AGORA_APP_ID!;
    this.appCertificate = process.env.AGORA_APP_CERTIFICATE!;
  }

  /**
   * Generate Agora RTC token for video/audio calls
   */
  async generateToken(channelName: string, uid: string, role: 'publisher' | 'subscriber' = 'publisher'): Promise<string> {
    const expireTime = Math.floor(Date.now() / 1000) + (24 * 3600); // 24 hours
    const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    
    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channelName,
      uid: parseInt(uid),
      agoraRole,
      expireTime
    );

    return token;
  }

  /**
   * Generate tokens for both client and interpreter
   */
  async generateSessionTokens(channelName: string, clientId: string, interpreterId: string) {
    const [clientToken, interpreterToken] = await Promise.all([
      this.generateToken(channelName, clientId, 'publisher'),
      this.generateToken(channelName, interpreterId, 'publisher')
    ]);

    return {
      clientToken,
      interpreterToken,
      appId: this.appId,
      channelName
    };
  }

  /**
   * Create recording resource for session recording
   */
  async startCloudRecording(channelName: string, uid: string) {
    try {
      const response = await fetch('https://api.agora.io/v1/apps/{appid}/cloud_recording/resourceid', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cname: channelName,
          uid: uid,
          clientRequest: {
            recordingConfig: {
              maxIdleTime: 30,
              streamTypes: 2, // audio and video
              audioProfile: 1,
              channelType: 1,
              videoStreamType: 0,
              transcodingConfig: {
                height: 640,
                width: 360,
                bitrate: 500,
                fps: 15,
                mixedVideoLayout: 1,
              }
            },
            storageConfig: {
              accessKey: process.env.AWS_ACCESS_KEY_ID,
              region: process.env.AWS_REGION,
              bucket: process.env.AWS_S3_BUCKET,
              secretKey: process.env.AWS_SECRET_ACCESS_KEY,
              vendor: 1, // AWS S3
              fileNamePrefix: [`recordings/session-${channelName}`]
            }
          }
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop cloud recording
   */
  async stopCloudRecording(resourceId: string, sid: string, channelName: string, uid: string) {
    try {
      const response = await fetch(`https://api.agora.io/v1/apps/{appid}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cname: channelName,
          uid: uid,
          clientRequest: {}
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }
}

export default AgoraAPI;
