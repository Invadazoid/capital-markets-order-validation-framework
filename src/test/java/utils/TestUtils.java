package utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class TestUtils {

    private static final Pattern NOW_PATTERN = Pattern.compile("\\{\\{now format='([^']+)'\\}\\}");
    private static final Pattern ORDER_ID_PATTERN = Pattern.compile("\"orderId\"\\s*:\\s*\"([^\"]*)\"");

    private TestUtils() { }

    public static String expandNowPlaceholders(String src) {
        if (src == null) return null;
        Matcher m = NOW_PATTERN.matcher(src);
        String result = src;
        while (m.find()) {
            String fmt = m.group(1);
            String placeholder = m.group(0);
            String replacement;
            try {
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern(fmt);
                replacement = LocalDateTime.now().format(dtf);
            } catch (Exception ex) {
                replacement = String.valueOf(System.currentTimeMillis());
            }
            result = result.replace(placeholder, replacement);
            m = NOW_PATTERN.matcher(result);
        }
        return result;
    }

    public static String ensureOrderId(String payload) {
        if (payload == null) return null;
        payload = expandNowPlaceholders(payload);

        Matcher m = ORDER_ID_PATTERN.matcher(payload);
        if (m.find()) {
            String val = m.group(1);
            if (val == null || val.isEmpty() || val.contains("{{")) {
                String orderId = "ORD-" + UUID.randomUUID().toString();
                return m.replaceFirst(Matcher.quoteReplacement("\"orderId\":\"" + orderId + "\""));
            }
            return payload;
        }

        String orderId = "ORD-" + UUID.randomUUID().toString();
        return payload.replaceFirst("\\{", Matcher.quoteReplacement("\\{\"orderId\":\"" + orderId + "\","));
    }

    public static String expandAndEnsure(String payload) {
        return ensureOrderId(expandNowPlaceholders(payload));
    }
}