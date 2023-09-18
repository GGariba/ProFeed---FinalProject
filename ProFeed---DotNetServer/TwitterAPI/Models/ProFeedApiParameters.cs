using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TwitterAPI.Models
{
    public static class ProFeedApiParameters
    {
        public static class ProFeedAlgParameters
        {
            public static int MaxFolowers = 1000000;
            public static int MinFolowers = 5000;
            public static double MinRankFirstStep = 0.87;
            public static double MinRankScondStep = 0.92;
            public static int AMPLIFIER = 5;
        }
        public static class TwitterModelParameters
        {
            public static string ApiKey = "";
            public static string AccessTokenSecret = "";
            public static string AccessToken = "";
            public static string ApiKeySecret = "";
        }
        public static class ProFeedAppParameters
        {
            public static double PRO_RANGE = 0.35;
            public static double MIN_RANGE = 0.25;
            public static int MINIMUM_RETWEETS = 5;
        }
        public static class ProFeedInfluencerParameters
        {
            public static double InfluencerVolumeSmall = 100000;
            public static double InfluencerVolumeMedium = 500000;
        
            public static double InfluencerEngagementLarge = 3;
            public static double InfluencerEngagementMedium = 2;
            public static double InfluencerEngagementSmall = 1;

            public static double InfluencerGneralActivityLarge = 2;
            public static double InfluencerGneralActivityMedium = 1.2;
        }
    }
}
