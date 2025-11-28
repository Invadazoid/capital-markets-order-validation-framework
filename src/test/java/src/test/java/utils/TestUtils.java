package utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Utility used by tests to:
 *  - Expand {{now format='...'}} placeholders
 *  - Ensure a unique orderId exists (ORD-UUID)
 */
public final class TestUtils {

    private static final Pattern NOW_PATTERN =
            Pattern.compile("\\{\\{now format='([^']+)'\\}\\}");

    private static final Pattern ORDER_ID_PATTERN =
            Pattern.compile("\"orderId\"\\s*:\\s*\"([^\"]*)\"");

    private TestUtils() {}

    /** Expand {{now format='...'}} → formatted timestamp */
    public static String expandNowPlaceholders(String src) {
        if (src == null) return null;
        Matcher m = NOW_PATTERN.matcher(src);
        StringBuffer sb = new StringBuffer();

        while (m.find()) {
            String fmt = m.group(1);
            String replacement;
            try {
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern(fmt);
                replacement = LocalDateTime.now().format(dtf);
            } catch (Exception e) {
                replacement = String.valueOf(System.currentTimeMillis());
            }
            m.appendReplacement(sb, Matcher.quoteReplacement(replacement));
        }

        m.appendTail(sb);
        return sb.toString();
    }

    /** Ensure orderId exists; inject ORD-UUID if missing or templated */
    public static String ensureOrderId(String payload) {
        if (payload == null) return null;

        payload = expandNowPlaceholders(payload);

        Matcher m = ORDER_ID_PATTERN.matcher(payload);

        if (m.find()) {
            String val = m.group(1);
            if (val == null || val.isEmpty() || val.contains("{{")) {
                String orderId = "ORD-" + UUID.randomUUID().toString();
                return m.replaceFirst("\"orderId\":\"" + orderId + "\"");
            }
            return payload;
        }

        // No orderId key: inject new one after first '{'
        String orderId = "ORD-" + UUID.randomUUID().toString();
        return payload.replaceFirst("\\{", "\\{\"orderId\":\"" + orderId + "\",");
    }

    /** Convenience: expand templates + ensure orderId */
    public static String expandAndEnsure(String payload) {
        return ensureOrderId(expandNowPlaceholders(payload));
    }
}
