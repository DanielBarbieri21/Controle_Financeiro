# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /Users/user/Library/Android/sdk/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If you use reflectionNeededClasses.txt, uncomment this to ensure that classes mentioned in the
# file are kept.
#-keep class com.google.common.reflect.Reflection {
#    public static <T> java.lang.Class<T> load(java.lang.Class<T>, java.lang.String);
#}
#-keepattributes Signature

# For using GSON @Expose annotation
#-keepattributes *Annotation*

# Gson specific classes
#-keep class sun.misc.Unsafe { *; }
#-keep class com.google.gson.stream.** { *; }

# JSR 305 Annotations
#-keep @interface javax.annotation.Nullable
#-keep @interface javax.annotation.Nonnull
#-keep @interface javax.annotation.concurrent.GuardedBy

# Support library annotations
#-keep @interface androidx.annotation.Keep
#-keep @interface android.support.annotation.Keep
#-keepnames @androidx.annotation.Keep class *
#-keepnames @android.support.annotation.Keep class *
#-keepclassmembers class * {
#    @androidx.annotation.Keep *;
#    @android.support.annotation.Keep *;
#}
