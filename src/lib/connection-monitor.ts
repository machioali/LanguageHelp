// Connection Quality Monitor for WebRTC calls
// Tracks bandwidth, latency, packet loss, and provides quality recommendations

export interface ConnectionStats {
  bandwidth: {
    upload: number; // kbps
    download: number; // kbps
  };
  latency: number; // ms
  packetLoss: number; // percentage
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

export class ConnectionMonitor {
  private peerConnection: RTCPeerConnection;
  private statsInterval: NodeJS.Timeout | null = null;
  private onStatsUpdate: (stats: ConnectionStats) => void;

  constructor(
    peerConnection: RTCPeerConnection,
    onStatsUpdate: (stats: ConnectionStats) => void
  ) {
    this.peerConnection = peerConnection;
    this.onStatsUpdate = onStatsUpdate;
  }

  startMonitoring(intervalMs: number = 5000): void {
    this.statsInterval = setInterval(async () => {
      try {
        const stats = await this.getConnectionStats();
        this.onStatsUpdate(stats);
      } catch (error) {
        console.error('Failed to get connection stats:', error);
      }
    }, intervalMs);
  }

  stopMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  private async getConnectionStats(): Promise<ConnectionStats> {
    const stats = await this.peerConnection.getStats();
    let uploadBandwidth = 0;
    let downloadBandwidth = 0;
    let latency = 0;
    let packetLoss = 0;

    stats.forEach((report) => {
      if (report.type === 'outbound-rtp' && report.kind === 'video') {
        uploadBandwidth = Math.round((report.bytesSent * 8) / 1000); // Convert to kbps
      }
      
      if (report.type === 'inbound-rtp' && report.kind === 'video') {
        downloadBandwidth = Math.round((report.bytesReceived * 8) / 1000);
        packetLoss = report.packetsLost / (report.packetsReceived + report.packetsLost) * 100;
      }
      
      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        latency = report.currentRoundTripTime * 1000; // Convert to ms
      }
    });

    const quality = this.calculateQuality(uploadBandwidth, downloadBandwidth, latency, packetLoss);
    const recommendations = this.getRecommendations(quality, latency, packetLoss);

    return {
      bandwidth: {
        upload: uploadBandwidth,
        download: downloadBandwidth
      },
      latency: Math.round(latency),
      packetLoss: Math.round(packetLoss * 100) / 100,
      quality,
      recommendations
    };
  }

  private calculateQuality(
    upload: number, 
    download: number, 
    latency: number, 
    packetLoss: number
  ): 'excellent' | 'good' | 'fair' | 'poor' {
    const minBandwidth = Math.min(upload, download);
    
    if (minBandwidth >= 1000 && latency < 100 && packetLoss < 1) {
      return 'excellent';
    } else if (minBandwidth >= 500 && latency < 200 && packetLoss < 3) {
      return 'good';
    } else if (minBandwidth >= 250 && latency < 400 && packetLoss < 5) {
      return 'fair';
    } else {
      return 'poor';
    }
  }

  private getRecommendations(
    quality: string, 
    latency: number, 
    packetLoss: number
  ): string[] {
    const recommendations: string[] = [];

    if (quality === 'poor') {
      recommendations.push('Consider switching to audio-only mode for better stability');
    }

    if (latency > 300) {
      recommendations.push('High latency detected - check your internet connection');
    }

    if (packetLoss > 5) {
      recommendations.push('Packet loss detected - try moving closer to your router');
    }

    if (quality === 'fair' || quality === 'poor') {
      recommendations.push('Close other applications using internet bandwidth');
      recommendations.push('Consider using ethernet instead of WiFi');
    }

    return recommendations;
  }

  // Manual network test
  async runNetworkTest(): Promise<{
    downloadSpeed: number; // Mbps
    uploadSpeed: number; // Mbps
    ping: number; // ms
  }> {
    try {
      // Simple download test using a small image
      const startDownload = Date.now();
      await fetch('/api/network-test/download', { cache: 'no-store' });
      const downloadTime = Date.now() - startDownload;
      const downloadSpeed = (100 * 8) / (downloadTime / 1000) / 1000000; // Estimate based on 100KB test

      // Simple upload test
      const startUpload = Date.now();
      const testData = new Blob([new ArrayBuffer(50000)]); // 50KB test data
      await fetch('/api/network-test/upload', {
        method: 'POST',
        body: testData
      });
      const uploadTime = Date.now() - startUpload;
      const uploadSpeed = (50 * 8) / (uploadTime / 1000) / 1000000;

      // Ping test (simple RTT)
      const startPing = Date.now();
      await fetch('/api/network-test/ping', { cache: 'no-store' });
      const ping = Date.now() - startPing;

      return {
        downloadSpeed: Math.round(downloadSpeed * 10) / 10,
        uploadSpeed: Math.round(uploadSpeed * 10) / 10,
        ping
      };
    } catch (error) {
      console.error('Network test failed:', error);
      return { downloadSpeed: 0, uploadSpeed: 0, ping: 999 };
    }
  }
}
